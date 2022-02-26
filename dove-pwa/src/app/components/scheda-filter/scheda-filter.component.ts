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
  @Input() tipo: string;
  componentRef: any;
  instance: SchedaFilterInterface;

  constructor() { 
  }
  
  ngOnInit(): void {
    this.loadComponent(this.tipo);
  }

  loadComponent(tipo: string) {
    const viewContainerRef = this.appSchedaFilter.viewContainerRef;
    viewContainerRef.clear();
    this.componentRef = viewContainerRef.createComponent<SchedaFilterInterface>(SchedaOggetto.filter[tipo]);
    this.instance = this.componentRef.instance;
    this.instance.ngOnInit();
  }

  filter(lista: Oggetto[]): Oggetto[] {
    return this.instance.filter(lista);
  };

}
