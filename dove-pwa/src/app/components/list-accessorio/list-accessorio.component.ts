import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Oggetto } from 'src/app/model/dove.model';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-accessorio',
  templateUrl: './list-accessorio.component.html',
  styleUrls: ['./list-accessorio.component.scss'],
})
export class ListAccessorioComponent implements OnInit {

  lista: Oggetto[];
  loading: boolean;

  constructor(
    private http: HttpClient,
    private shared: SharedDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.lista = [];
    this.loading = true;
    this.http.get<Oggetto[]>(`${environment.restUrl}/oggetto/accessorio/list`).subscribe({
      next: lista => {
        this.lista = lista;
      },
      error: this.shared.httpError
    });
  }

  clickOggetto(oggetto: Oggetto) {
    this.router.navigate(['oggetto', oggetto.id]);
  }

}
