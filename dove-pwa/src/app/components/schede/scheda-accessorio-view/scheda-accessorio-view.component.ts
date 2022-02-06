import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler';
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
  @Input() editable: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
