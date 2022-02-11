import { ChangeDetectorRef, Injectable } from '@angular/core';
import { JwtUserData, JwtUserDetails } from '../model/dove.model';
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
    this.user = JSON.parse(saved as string);
  }

  noUser() {
    this.user = null;
    localStorage.removeItem('dove-user');
  }

  setDetails(details: JwtUserDetails) {
    if (this.user) {
      this.user.details = details;
      this.setUser(this.user);
    }
  }

  httpError(error: any) {
    console.log(error);
  }

}

