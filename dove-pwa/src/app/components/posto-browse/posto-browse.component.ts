import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Posto, PostoBrowse } from 'src/app/model/dove.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-posto-browse',
  templateUrl: './posto-browse.component.html',
  styleUrls: ['./posto-browse.component.scss']
})
export class PostoBrowseComponent implements OnInit {

  uuid: string | null;
  browse: PostoBrowse;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.uuid = params.get('id');
      this.http.get<PostoBrowse>(`${environment.restUrl}/browse/posto/${this.uuid}`).subscribe(browse => {
        this.browse = browse;
      });
    });
  }

}
