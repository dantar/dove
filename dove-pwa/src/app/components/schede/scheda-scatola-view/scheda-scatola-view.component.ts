import { Component, OnInit } from '@angular/core';
import { SchedaScatola } from 'src/app/model/dove.model';
import { SchedaViewInterface } from '../../interfaces/scheda-view-interface';

@Component({
  selector: 'app-scheda-scatola-view',
  templateUrl: './scheda-scatola-view.component.html',
  styleUrls: ['./scheda-scatola-view.component.scss']
})
export class SchedaScatolaViewComponent implements OnInit, SchedaViewInterface {

  scheda: SchedaScatola;

  constructor() { }

  ngOnInit(): void {
  }

}
