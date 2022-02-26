import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SchedaViewDirective } from 'src/app/directives/scheda-view.directive';
import { SchedaOggetto } from 'src/app/model/dove.model';
import { SchedaScatola } from 'src/app/model/scatola.model';
import { SchedaViewInterface } from '../interfaces/scheda-view-interface';

@Component({
  selector: '[app-scheda-view]',
  templateUrl: './scheda-view.component.html',
  styleUrls: ['./scheda-view.component.scss']
})
export class SchedaViewComponent implements OnInit {

  @ViewChild(SchedaViewDirective, {static: true}) appSchedaView!: SchedaViewDirective;
  @Input() scheda: SchedaOggetto;
  @Input() mode: 'full'|'short'|'list' = 'full';
  @Output() save: EventEmitter<SchedaOggetto> = new EventEmitter<SchedaOggetto>();

  edit: SchedaOggetto | null;

  constructor() { 
  }
  
  ngOnInit(): void {
    this.loadComponent(this.scheda, false);
  }

  loadComponent(data: SchedaOggetto, editable: boolean) {
    const viewContainerRef = this.appSchedaView.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<SchedaViewInterface>(SchedaOggetto.view[data.tipo]);
    componentRef.instance.scheda = data;
    componentRef.instance.editable = editable;
    componentRef.instance.mode = editable ? 'full' : this.mode;
  }

  schedaAsSchedaOggetto(): SchedaScatola {
    return this.scheda as SchedaScatola;
  }

  openEdit() {
    this.edit = JSON.parse(JSON.stringify(this.scheda));
    this.loadComponent(this.edit as SchedaOggetto, true);
  }

  cancelEdit() {
    this.edit = null;
    this.loadComponent(this.scheda, false);
  }

  saveEdit() {
    this.save.emit(this.edit as SchedaOggetto);
    this.cancelEdit();
  }

}
