import { Injectable } from '@angular/core';
import { JwtUserData } from '../model/dove.model';
import { AuthRestService } from './auth-rest.service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  user: JwtUserData | null;

  constructor(
    private auth: AuthRestService,
  ) {
  }

  setUser(user: JwtUserData) {
    this.user = user;
    localStorage.setItem('dove-user', JSON.stringify(this.user));
  }

  loadUser() {
    let saved = localStorage.getItem('dove-user');
    if (saved) {
      this.user = JSON.parse(saved);
      this.auth.getUser().subscribe({
        next: user => {
          if (this.user) {
            this.user.details = user;
            this.setUser(this.user);
          }
        },
        error: this.httpError
      });
    }
  }

  httpError(error: any) {
    console.log(error);
    if (error.status === 401) {
      this.user = null;
      localStorage.removeItem('dove-user');
    }
  }

}

