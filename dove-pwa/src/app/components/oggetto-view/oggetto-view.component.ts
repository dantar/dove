import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Oggetto } from 'src/app/model/dove.model';

@Component({
  selector: '[app-oggetto-view]',
  templateUrl: './oggetto-view.component.html',
  styleUrls: ['./oggetto-view.component.scss']
})
export class OggettoViewComponent implements OnInit {

  @Input() oggetto: Oggetto;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  browse() {
    this.router.navigate(['oggetto', this.oggetto.id]);
  }

}
