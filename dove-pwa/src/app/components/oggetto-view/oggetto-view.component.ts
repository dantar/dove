import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-oggetto-view',
  templateUrl: './oggetto-view.component.html',
  styleUrls: ['./oggetto-view.component.scss']
})
export class OggettoViewComponent implements OnInit {

  uuid: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('id');
  }

}
