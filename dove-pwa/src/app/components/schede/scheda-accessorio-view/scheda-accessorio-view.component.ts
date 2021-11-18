import { Component, OnInit } from '@angular/core';
import { SchedaAccessorio } from 'src/app/model/dove.model';

@Component({
  selector: 'app-scheda-accessorio-view',
  templateUrl: './scheda-accessorio-view.component.html',
  styleUrls: ['./scheda-accessorio-view.component.scss']
})
export class SchedaAccessorioViewComponent implements OnInit {

  scheda: SchedaAccessorio;

  constructor() { }

  ngOnInit(): void {
  }

}
