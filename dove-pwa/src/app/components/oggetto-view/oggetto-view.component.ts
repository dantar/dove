import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Oggetto, SchedaOggetto, SchedaOggettoProto } from 'src/app/model/dove.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: '[app-oggetto-view]',
  templateUrl: './oggetto-view.component.html',
  styleUrls: ['./oggetto-view.component.scss']
})
export class OggettoViewComponent implements OnInit {

  @Input() oggetto: Oggetto;
  @Output() move = new EventEmitter<string>();
  gallery: GalleryCarousel;
  saving: boolean;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.gallery = new GalleryCarousel(this.oggetto);
    this.saving = false;
  }

  browse() {
    this.router.navigate(['oggetto', this.oggetto.id]);
  }

  saveScheda(scheda: SchedaOggetto) {
    this.oggetto.scheda = scheda;
    this.saving = true;
    this.saveAndReload().subscribe(oggetto => {
      this.saving = false;
      this.oggetto.scheda = oggetto.scheda;
    });
  }

  newSchedaAs(proto: SchedaOggettoProto) {
    this.oggetto.scheda = JSON.parse(JSON.stringify(proto.proto));
  }

  allSchedaProto(): SchedaOggettoProto[] {
    return SchedaOggetto.protos;
  }

  moveScheda(code: string) {
    this.oggetto.idPosto = code;
    this.saveAndReload().subscribe(oggetto => {
      this.oggetto.idPosto = oggetto.idPosto;
      this.move.emit(this.oggetto.idPosto);
    });
  }

  shootPicture(jpeg: string) {
    this.saving = true;
    this.http.post<string[]>(`${environment.restUrl}/oggetto/${this.oggetto.id}/picture`, jpeg)
    .subscribe(pictures => {
      this.saving = false;
      this.oggetto.immagini = pictures;
      this.gallery = new GalleryCarousel(this.oggetto);
    });
  }

  private saveAndReload(): Observable<Oggetto> {
    return this.http.post<Oggetto>(`${environment.restUrl}/oggetto`, this.oggetto);
  }

  deleteSelectedImages() {
    this.gallery.selected().forEach(i => {
      this.http.delete(`${environment.restUrl}/oggetto/${this.oggetto.id}/picture/${i.id}`)
      .subscribe(() => {
        this.gallery.remove(i);
      });
    });
  }

  thumbnailSelectedImage() {
    this.oggetto.thumbnail = this.gallery.selected()[0].id;
    this.saving = true;
    this.saveAndReload().subscribe(oggetto => {
      this.saving = false;
      this.oggetto.thumbnail = oggetto.thumbnail;
      this.gallery = new GalleryCarousel(this.oggetto);
    });
  }

}

class GalleryCarousel {
  shown: GalleryImage[];
  more: GalleryImage[];
  zoomed: boolean;
  imageMap: {[id: string]: GalleryImage};

  constructor(oggetto: Oggetto) {
    this.zoomed = false;
    this.imageMap = {};
    this.more = oggetto.immagini.map(p => this.newGalleryImage(oggetto, p));
    this.shown = [];
    if (oggetto.thumbnail && oggetto.immagini.indexOf(oggetto.thumbnail) >= 0) {
      this.more.splice(oggetto.immagini.indexOf(oggetto.thumbnail), 1);
      this.more.splice(0, 0, this.imageMap[oggetto.thumbnail]);
    }
    if (this.more.length > 0) {
      this.shown.push(...this.more.splice(0, 1));
    }
  }
  newGalleryImage(oggetto: Oggetto, p: string): GalleryImage {
    let image = new GalleryImage(oggetto, p);
    this.imageMap[p] = image;
    return image;
  }

  showAll() {
    this.shown.push(...this.more);
    this.more = [];
  }

  selected(): GalleryImage[] {
    return this.shown.filter(i => i.selected);
  }

  remove(i: GalleryImage) {
    this.shown.splice(this.shown.indexOf(i), 1);
  }

  toggle() {
    this.zoomed = ! this.zoomed;
  }

}

class GalleryImage {
  id: string;
  src: string;
  selected: boolean;
  constructor(oggetto: Oggetto, img: string) {
    this.id = img;
    this.src = `${environment.imgsUrl}/${oggetto.id}/${img}`;
    this.selected = false;
  }
  toggle() {
    this.selected = !this.selected;
  }
}