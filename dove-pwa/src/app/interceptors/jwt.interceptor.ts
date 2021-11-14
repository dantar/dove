import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedDataService } from '../services/shared-data.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private shared: SharedDataService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.shared.user?.token) {
      const token = this.shared.user.token;
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      });
  }
    return next.handle(request);
  }

}
