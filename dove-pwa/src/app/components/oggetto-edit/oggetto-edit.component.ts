import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Oggetto, SchedaOggetto } from 'src/app/model/dove.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: '[app-oggetto-edit]',
  templateUrl: './oggetto-edit.component.html',
  styleUrls: ['./oggetto-edit.component.scss']
})
export class OggettoEditComponent implements OnInit {

  @Input() oggetto: Oggetto;
  @Output() done = new EventEmitter<Oggetto>();

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }

  save() {
    // DEBT: saving...
    this.http.post<Oggetto>(`${environment.restUrl}/oggetto`, this.oggetto)
    .subscribe(oggetto => {
      this.done.emit(oggetto);
    });
  }

  newScheda() {
    this.oggetto.scheda = new SchedaOggetto();
  }

}
