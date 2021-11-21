import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Oggetto, OggettoBrowse } from 'src/app/model/dove.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-oggetto-browse',
  templateUrl: './oggetto-browse.component.html',
  styleUrls: ['./oggetto-browse.component.scss']
})
export class OggettoBrowseComponent implements OnInit {

  uuid: string | null;
  browse: OggettoBrowse | null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.browse = null;
    this.route.paramMap.subscribe(params => {
      this.uuid = params.get('id');
      this.http.get<OggettoBrowse>(`${environment.restUrl}/browse/oggetto/${this.uuid}`).subscribe(browse => {
        this.browse = browse;
      });
    });
  }

}
