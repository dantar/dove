import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Posto, PostoBrowse } from 'src/app/model/dove.model';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-posto-browse',
  templateUrl: './posto-browse.component.html',
  styleUrls: ['./posto-browse.component.scss']
})
export class PostoBrowseComponent implements OnInit {

  uuid: string | null;
  browse: PostoBrowse;

  nuovoPosto: Posto;
  adding: boolean;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private shared: SharedDataService,
  ) { }

  ngOnInit(): void {
    this.adding = false;
    this.route.paramMap.subscribe(params => {
      this.uuid = params.get('id');
      this.http.get<PostoBrowse>(`${environment.restUrl}/browse/posto/${this.uuid}`).subscribe({
        next: browse => {
          this.browse = browse;
        },
        error: this.shared.httpError
      });
    });
  }

  addItem(qrcode: string) {
    this.http.post<PostoBrowse>(`${environment.restUrl}/browse/posto/${this.uuid}/add/${qrcode}`, {}).subscribe({
      next: browse => {
        this.adding = false;
        this.browse = browse;
      },
      error: this.shared.httpError
    });
  }

}
