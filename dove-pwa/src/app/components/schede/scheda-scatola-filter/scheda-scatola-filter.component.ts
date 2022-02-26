import { Component, OnInit } from '@angular/core';
import { Oggetto } from 'src/app/model/dove.model';
import { SchedaFilterInterface } from '../../interfaces/scheda-filter-interface';

@Component({
  selector: '[app-scheda-scatola-filter]',
  templateUrl: './scheda-scatola-filter.component.html',
  styleUrls: ['./scheda-scatola-filter.component.scss']
})
export class SchedaScatolaFilterComponent implements OnInit, SchedaFilterInterface {

  constructor() { }

  ngOnInit(): void {
  }

  filter(lista: Oggetto[]): Oggetto[] {
    return lista.filter(o => o.scheda.tipo === 'scatola');
  }

}
