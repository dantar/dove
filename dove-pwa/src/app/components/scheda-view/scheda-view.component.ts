import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SchedaViewDirective } from 'src/app/directives/scheda-view.directive';
import { SchedaOggetto, SchedaScatola } from 'src/app/model/dove.model';
import { SchedaViewInterface } from '../interfaces/scheda-view-interface';

@Component({
  selector: '[app-scheda-view]',
  templateUrl: './scheda-view.component.html',
  styleUrls: ['./scheda-view.component.scss']
})
export class SchedaViewComponent implements OnInit {

  @ViewChild(SchedaViewDirective, {static: true}) appSchedaView!: SchedaViewDirective;
  @Input() scheda: SchedaOggetto;
  @Output() save: EventEmitter<SchedaOggetto> = new EventEmitter<SchedaOggetto>();
  @Output() move: EventEmitter<string> = new EventEmitter<string>();
  moving: boolean;

  constructor() { 
  }
  
  ngOnInit(): void {
    this.moving = false;
    this.loadComponent();
  }

  loadComponent() {
    const viewContainerRef = this.appSchedaView.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<SchedaViewInterface>(SchedaOggetto.component[this.scheda.tipo]);
    componentRef.instance.scheda = this.scheda;
    if (componentRef.instance.save) {
      componentRef.instance.save.subscribe(scheda => {
        this.save.emit(scheda);
        this.scheda = scheda;
        this.loadComponent();
      });
    }
  }

  schedaAsSchedaOggetto(): SchedaScatola {
    return this.scheda as SchedaScatola;
  }

  openMove() {
    this.moving = true;
  }

  moveToCode(code: string) {
    this.move.emit(code);
    this.moving = false;
  }


}
