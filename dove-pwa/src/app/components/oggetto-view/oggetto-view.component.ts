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
    this.http.post<string[]>(`${environment.restUrl}/oggetto/${this.oggetto.id}/picture`, jpeg)
    .subscribe(pictures => {
      this.oggetto.immagini = pictures;
    });
  }

  private saveAndReload(): Observable<Oggetto> {
    return this.http.post<Oggetto>(`${environment.restUrl}/oggetto`, this.oggetto);
  }

}

class GalleryCarousel {
  shown: GalleryImage[];
  more: GalleryImage[];
  constructor(oggetto: Oggetto) {
    this.more = oggetto.immagini.map(p => new GalleryImage(oggetto, p));
    this.shown = [];
    if (oggetto.immagini.length > 0) {
      this.shown.push(...this.more.splice(0, 1));
    }
  }

  showAll() {
    this.shown.push(...this.more);
    this.more = [];
  }

}

class GalleryImage {
  src: string
  constructor(oggetto: Oggetto, img: string) {
    this.src = `${environment.imgsUrl}/${oggetto.id}/${img}`;
  }
}