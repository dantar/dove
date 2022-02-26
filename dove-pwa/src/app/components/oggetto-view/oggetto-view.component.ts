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
  moving: boolean;
  shooting: boolean;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.gallery = new GalleryCarousel(this.oggetto);
    this.saving = false;
    this.moving = false;
    this.shooting = false;
  }

  browse() {
    this.router.navigate(['oggetto', this.oggetto.id]);
  }

  saveScheda(scheda: SchedaOggetto) {
    this.oggetto.scheda = scheda;
    this.saveAndReload().subscribe(oggetto => {
      this.saving = false;
      this.oggetto.scheda = oggetto.scheda;
    });
  }

  newSchedaAs(proto: SchedaOggettoProto) {
    this.oggetto.scheda = JSON.parse(JSON.stringify(proto.proto));
  }

  allSchedaProto(): SchedaOggettoProto[] {
    return Object.values(SchedaOggetto.protos);
  }

  moveScheda(code: string) {
    this.moving = false;
    this.oggetto.idPosto = code;
    this.saveAndReload().subscribe(oggetto => {
      this.saving = false;
      this.oggetto.idPosto = oggetto.idPosto;
      this.move.emit(this.oggetto.idPosto);
    });
  }

  shootPicture(jpeg: string) {
    this.shooting = false;
    this.saving = true;
    this.http.post<string[]>(`${environment.restUrl}/oggetto/${this.oggetto.id}/picture`, jpeg)
    .subscribe(pictures => {
      this.saving = false;
      this.oggetto.immagini = pictures;
      this.gallery = new GalleryCarousel(this.oggetto);
    });
  }

  private saveAndReload(): Observable<Oggetto> {
    this.saving = true;
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
    this.saveAndReload().subscribe(oggetto => {
      this.saving = false;
      this.oggetto.thumbnail = oggetto.thumbnail;
      this.gallery = new GalleryCarousel(this.oggetto);
    });
  }

  nomeOggetto(): string {
    return SchedaOggetto.nomeOf(this.oggetto);
  }


}

class GalleryCarousel {
  shown: GalleryImage[];
  zoomed: boolean;
  imageMap: {[id: string]: GalleryImage};
  mode: 'full'|'thumbnail'|'missing';

  constructor(oggetto: Oggetto) {
    this.zoomed = false;
    this.imageMap = {};
    this.mode = oggetto.immagini.length > 0 ? 'full' : oggetto.thumbnail ? 'thumbnail': 'missing';
    this.shown = [];
    if (oggetto.thumbnail) {
      this.shown.push(this.newGalleryImage(oggetto, oggetto.thumbnail));
    }
    oggetto.immagini.filter(i => i!= oggetto.thumbnail).forEach(p => this.shown.push(this.newGalleryImage(oggetto, p)));
  }

  newGalleryImage(oggetto: Oggetto, p: string): GalleryImage {
    let image = new GalleryImage(oggetto, p);
    this.imageMap[p] = image;
    return image;
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