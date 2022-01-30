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
  @Input() editable: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
