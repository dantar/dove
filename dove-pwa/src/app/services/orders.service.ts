import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdineBrowse } from '../model/dove.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  current: OrdineBrowse;

  constructor(
    private http: HttpClient,
  ) { }

  mieiOrdini(): Observable<OrdineBrowse[]> {
    return this.http.get<OrdineBrowse[]>(`${environment.restUrl}/orders`);
  }

  setCurrent(ordine: OrdineBrowse) {
    this.current = ordine;
  }

}
