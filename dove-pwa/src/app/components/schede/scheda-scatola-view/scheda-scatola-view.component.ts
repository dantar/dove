import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SchedaOggetto, SchedaScatola } from 'src/app/model/dove.model';
import { SchedaViewInterface } from '../../interfaces/scheda-view-interface';

@Component({
  selector: '[app-scheda-scatola-view]',
  templateUrl: './scheda-scatola-view.component.html',
  styleUrls: ['./scheda-scatola-view.component.scss']
})
export class SchedaScatolaViewComponent implements OnInit, SchedaViewInterface {

  @Input() scheda: SchedaScatola;
  edit: SchedaScatola | null;
  @Output() save: EventEmitter<SchedaOggetto> = new EventEmitter<SchedaOggetto>();

  constructor() { }

  ngOnInit(): void {
  }

  openEdit() {
    this.edit = JSON.parse(JSON.stringify(this.scheda));
  }

  cancelEdit() {
    this.edit = null;
  }

  saveEdit() {
    this.save.emit(this.edit as SchedaScatola);
    this.edit = null;
  }

}
