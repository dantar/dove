import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Oggetto, SchedaOggetto } from 'src/app/model/dove.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: '[app-oggetto-view]',
  templateUrl: './oggetto-view.component.html',
  styleUrls: ['./oggetto-view.component.scss']
})
export class OggettoViewComponent implements OnInit {

  @Input() oggetto: Oggetto;

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
    this.http.post<Oggetto>(`${environment.restUrl}/oggetto`, this.oggetto)
    .subscribe(oggetto => {
      this.oggetto.scheda = oggetto.scheda;
    });
  }

}
