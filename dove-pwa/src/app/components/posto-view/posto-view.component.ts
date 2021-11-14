import { Component, Input, OnInit } from '@angular/core';
import { Posto } from 'src/app/model/dove.model';

@Component({
  selector: 'app-posto-view',
  templateUrl: './posto-view.component.html',
  styleUrls: ['./posto-view.component.scss']
})
export class PostoViewComponent implements OnInit {

  @Input() posto: Posto;

  constructor() { }

  ngOnInit(): void {
  }

}
