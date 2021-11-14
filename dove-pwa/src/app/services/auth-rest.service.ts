import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtUserData } from '../model/dove.model';

@Injectable({
  providedIn: 'root'
})
export class AuthRestService {

  constructor(
    private http: HttpClient,
    ) { }

  login(username: string, password: string): Observable<JwtUserData> {
    return this.http.post<JwtUserData>(`${environment.restUrl}/authenticate`, null, {
      params: { username, password }
    });
  }

}
