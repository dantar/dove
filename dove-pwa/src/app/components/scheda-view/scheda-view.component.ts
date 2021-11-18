import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SchedaViewDirective } from 'src/app/directives/scheda-view.directive';
import { SchedaOggetto } from 'src/app/model/dove.model';
import { SchedaViewInterface } from '../interfaces/scheda-view-interface';

@Component({
  selector: '[app-scheda-view]',
  templateUrl: './scheda-view.component.html',
  styleUrls: ['./scheda-view.component.scss']
})
export class SchedaViewComponent implements OnInit {

  @ViewChild(SchedaViewDirective, {static: true}) appSchedaView!: SchedaViewDirective;
  @Input() scheda: SchedaOggetto;

  constructor() { }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    const viewContainerRef = this.appSchedaView.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<SchedaViewInterface>(SchedaOggetto.component[this.scheda.tipo]);
    componentRef.instance.scheda = this.scheda;
  }

}
