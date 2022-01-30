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
  @Output() shoot: EventEmitter<string> = new EventEmitter<string>();
  moving: boolean;
  shooting: boolean;

  edit: SchedaOggetto | null;

  constructor() { 
  }
  
  ngOnInit(): void {
    this.moving = false;
    this.shooting = false;
    this.loadComponent(this.scheda, false);
  }

  loadComponent(data: SchedaOggetto, editable: boolean) {
    const viewContainerRef = this.appSchedaView.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<SchedaViewInterface>(SchedaOggetto.component[data.tipo]);
    componentRef.instance.scheda = data;
    componentRef.instance.editable = editable;
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

  openShoot() {
    this.shooting = true;
  }

  loadPicture(jpeg: string) {
    this.shooting = false;
    this.shoot.emit(jpeg);
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