import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Oggetto, Posto, PostoBrowse } from 'src/app/model/dove.model';
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
  edit: Posto | null;

  nuovoPosto: Posto;
  adding: boolean;
  saving: boolean;
  branching: boolean;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private shared: SharedDataService,
  ) { }

  ngOnInit(): void {
    this.adding = false;
    this.saving = false;
    this.branching = false;
    this.edit = null;
    this.route.paramMap.subscribe(params => {
      this.uuid = params.get('id');
      this.loadBrowse();
    });
  }

  loadBrowse() {
    this.fetchDto().subscribe({
      next: browse => {
        this.uuid = browse.posto.id;
        this.browse = browse;
      },
      error: this.shared.httpError
    });
  }
  
  fetchDto(): Observable<PostoBrowse> {
    return this.uuid ? this.http.get<PostoBrowse>(`${environment.restUrl}/browse/posto/${this.uuid}`)
    : this.http.get<PostoBrowse>(`${environment.restUrl}/browse/root`);
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

  itemMoved(oggetto: Oggetto) {
      this.loadBrowse();
  }

  openEdit() {
    this.edit = JSON.parse(JSON.stringify(this.browse.posto));
  }

  cancelEdit() {
    this.edit = null;
  }

  saveEdit() {
    this.saving = true;
    this.http.post<Posto>(`${environment.restUrl}/posto`, this.edit).subscribe({
      next: posto => {
        this.saving = false;
        this.browse.posto = posto;
        this.cancelEdit();
      },
      error: this.shared.httpError
    });
  }

  addPosto(qrcode: string) {
    this.http.post<Posto>(`${environment.restUrl}/posto/${this.browse.posto.id}/${qrcode}`, null).subscribe({
      next: posto => {
        this.branching = false;
        this.browse.posti.push(posto);
      },
      error: this.shared.httpError
    });
  }
  
}
