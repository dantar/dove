import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Posto } from 'src/app/model/dove.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-posto-browse',
  templateUrl: './posto-browse.component.html',
  styleUrls: ['./posto-browse.component.scss']
})
export class PostoBrowseComponent implements OnInit {

  uuid: string | null;
  posto: Posto;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('id');
    this.http.get(`${environment.restUrl}/posto/${this.uuid}`);
  }

}
