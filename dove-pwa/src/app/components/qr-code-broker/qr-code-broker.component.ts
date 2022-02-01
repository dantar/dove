import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Oggetto } from 'src/app/model/dove.model';
import { Posto } from 'src/app/model/dove.model';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qr-code-broker',
  templateUrl: './qr-code-broker.component.html',
  styleUrls: ['./qr-code-broker.component.scss']
})
export class QrCodeBrokerComponent implements OnInit {

  qrcode: string | null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private shared: SharedDataService,
    ) { }

  ngOnInit(): void {
  }

  qrcodeRead(qrcode: string) {
    this.qrcode = qrcode;
    this.http.get<BrokerDto>(`${environment.restUrl}/broker/${qrcode}`).subscribe({
      next: broker => {
        if (broker.oggetto && !broker.posto) {
          this.router.navigate(['oggetto', qrcode]);
        } else if (!broker.oggetto && broker.posto) {
          this.router.navigate(['posto', qrcode]);
        };
      },
      error: this.shared.httpError
    });
  }

}

export class BrokerDto {

  oggetto: Oggetto;
  posto: Posto;

}