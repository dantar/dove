import { Component, Input, OnInit } from '@angular/core';
import { Oggetto } from 'src/app/model/dove.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: '[app-oggetto-thumbnail]',
  templateUrl: './oggetto-thumbnail.component.html',
  styleUrls: ['./oggetto-thumbnail.component.scss']
})
export class OggettoThumbnailComponent implements OnInit {

  @Input() oggetto: Oggetto;
  imgSrc: string;

  constructor() { }

  ngOnInit(): void {
    this.imgSrc = `${environment.imgsUrl}/${this.oggetto.id}/${this.oggetto.thumbnail}`;
  }


}
