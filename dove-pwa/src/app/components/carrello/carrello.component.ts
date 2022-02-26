import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OrdineBrowse } from 'src/app/model/dove.model';
import { OrdersService } from 'src/app/services/orders.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.scss']
})
export class CarrelloComponent implements OnInit {

  ordine: OrdineBrowse;
  ordini: OrdineBrowse[];

  constructor(
    private orders: OrdersService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    if (this.orders.current) {
      this.ordine = this.orders.current;
      this.http.get<OrdineBrowse>(`${environment.restUrl}/ordine/${this.orders.current.ordine.id}`).subscribe(
        ordine => this.setOrdine(ordine)
      )
    }
    this.http.get<OrdineBrowse[]>(`${environment.restUrl}/ordine/aperti`).subscribe(
      ordini => {
        this.ordini = ordini;
        if (!this.ordine && this.ordini.length > 0) {
          this.setOrdine(ordini[0]);
        }
      }
    )
  }

  setOrdine(ordine: OrdineBrowse) {
    this.orders.setCurrent(ordine);
    this.ordine = ordine;
  }

}
