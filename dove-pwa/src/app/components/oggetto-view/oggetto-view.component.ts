import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Oggetto, SchedaOggetto } from 'src/app/model/dove.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: '[app-oggetto-view]',
  templateUrl: './oggetto-view.component.html',
  styleUrls: ['./oggetto-view.component.scss']
})
export class OggettoViewComponent implements OnInit {

  @Input() oggetto: Oggetto;
  @Output() move = new EventEmitter<string>();

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }

  browse() {
    this.router.navigate(['oggetto', this.oggetto.id]);
  }

  saveScheda(scheda: SchedaOggetto) {
    this.oggetto.scheda = scheda;
    this.saveAndReload().subscribe(oggetto => {
      this.oggetto.scheda = oggetto.scheda;
    });
  }

  moveScheda(code: string) {
    this.oggetto.idPosto = code;
    this.saveAndReload().subscribe(oggetto => {
      this.oggetto.idPosto = oggetto.idPosto;
      this.move.emit(this.oggetto.idPosto);
    });
  }

  private saveAndReload(): Observable<Oggetto> {
    return this.http.post<Oggetto>(`${environment.restUrl}/oggetto`, this.oggetto);
  }

}
