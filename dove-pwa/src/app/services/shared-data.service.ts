import { Injectable } from '@angular/core';
import { JwtUserData } from '../model/dove.model';
import { AuthRestService } from './auth-rest.service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  user: JwtUserData;

  constructor(
    private auth: AuthRestService,
  ) {
    let saved = localStorage.getItem('dove-user');
    if (saved) {
      this.user = JSON.parse(saved);
    }


  }

  setUser(user: JwtUserData) {
    this.user = user;
    localStorage.setItem('dove-user', JSON.stringify(this.user));
  }

}

