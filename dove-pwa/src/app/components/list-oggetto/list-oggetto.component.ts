import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Oggetto } from 'src/app/model/dove.model';
import { environment } from 'src/environments/environment';
import { SchedaAccessorioFilterComponent } from '../schede/scheda-accessorio-filter/scheda-accessorio-filter.component';

@Component({
  selector: '[app-list-oggetto]',
  templateUrl: './list-oggetto.component.html',
  styleUrls: ['./list-oggetto.component.scss']
})
export class ListOggettoComponent implements OnInit {

  @Input() lista: Oggetto[];
  @Output() move = new EventEmitter<Oggetto>();
  loading: boolean;
  @ViewChild('accessoriofilter') accessoriofilter: SchedaAccessorioFilterComponent;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  clickOggetto(oggetto: Oggetto) {
    this.router.navigate(['oggetto', oggetto.id]);
  }

  imgSrc(oggetto: Oggetto): string {
    return `${environment.imgsUrl}/${oggetto.id}/${oggetto.thumbnail}`
  }

  shown(): Oggetto[] {
    return this.accessoriofilter ? this.accessoriofilter.filter(this.lista) : this.lista;
  }

}
