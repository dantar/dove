import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Oggetto } from 'src/app/model/dove.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: '[app-list-oggetto]',
  templateUrl: './list-oggetto.component.html',
  styleUrls: ['./list-oggetto.component.scss']
})
export class ListOggettoComponent implements OnInit {

  @Input() lista: Oggetto[];
  @Output() move = new EventEmitter<Oggetto>();
  loading: boolean;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  clickOggetto(oggetto: Oggetto) {
    this.router.navigate(['oggetto', oggetto.id]);
  }

  imgSrc(oggetto: Oggetto): string {
    return `${environment.imgsUrl}/${oggetto.id}/${oggetto.thumbnail}`
  }

}
