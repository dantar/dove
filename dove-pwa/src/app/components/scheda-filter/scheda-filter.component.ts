import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SchedaFilterDirective } from 'src/app/directives/scheda-filter.directive';
import { Oggetto, SchedaOggetto } from 'src/app/model/dove.model';
import { SchedaFilterInterface } from '../interfaces/scheda-filter-interface';

@Component({
  selector: '[app-scheda-filter]',
  templateUrl: './scheda-filter.component.html',
  styleUrls: ['./scheda-filter.component.scss']
})
export class SchedaFilterComponent implements OnInit, SchedaFilterInterface {

  @ViewChild(SchedaFilterDirective, {static: true}) appSchedaFilter!: SchedaFilterDirective;
  @Input() lista: Oggetto[];
  tipo: string | null;
  componentRef: any;
  instance: SchedaFilterInterface | null;

  constructor() { 
  }
  
  ngOnInit(): void {
  }

  loadComponent(tipo: string) {
    const viewContainerRef = this.appSchedaFilter.viewContainerRef;
    viewContainerRef.clear();
    this.componentRef = viewContainerRef.createComponent<SchedaFilterInterface>(SchedaOggetto.filter[tipo]);
    this.instance = this.componentRef.instance;
    this.instance && this.instance.ngOnInit();
  }

  flushComponent() {
    this.instance = null;
    this.appSchedaFilter.viewContainerRef.clear();
  }

  filter(lista: Oggetto[]): Oggetto[] {
    return this.instance ? this.instance.filter(lista) : lista;
  };

  selectTipo(tipo: string) {
    if (this.tipo === tipo) {
      this.tipo = null;
      this.flushComponent();
    } else {
      this.tipo = tipo;
      this.loadComponent(this.tipo);
    }
  }

  tipoOptions(): TipoOption[] {
    return [...new Set(this.lista.map(o => o.scheda ? o.scheda.tipo : 'null'))]
    .map(tipo => new TipoOption(tipo, SchedaOggetto.protos[tipo].nome));
  };

}

export class TipoOption {

  tipo: string;
  label: string;

  constructor(tipo: string, label: string) {
    this.tipo = tipo;
    this.label = label;
  }

}