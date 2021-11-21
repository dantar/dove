import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SchedaAccessorio, SchedaOggetto } from 'src/app/model/dove.model';
import { SchedaViewInterface } from '../../interfaces/scheda-view-interface';

@Component({
  selector: '[app-scheda-accessorio-view]',
  templateUrl: './scheda-accessorio-view.component.html',
  styleUrls: ['./scheda-accessorio-view.component.scss']
})
export class SchedaAccessorioViewComponent implements OnInit, SchedaViewInterface {

  @Input() scheda: SchedaAccessorio;
  edit: SchedaAccessorio | null;
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
    this.save.emit(this.edit as SchedaAccessorio);
    this.edit = null;
  }

}
