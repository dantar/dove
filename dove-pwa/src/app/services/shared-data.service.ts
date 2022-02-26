import { ChangeDetectorRef, Injectable } from '@angular/core';
import { JwtUserData, JwtUserDetails } from '../model/dove.model';
import { AuthRestService } from './auth-rest.service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  user: JwtUserData | null;
  settings: UserSettings;

  constructor(
    private auth: AuthRestService,
  ) {
  }

  setUser(user: JwtUserData) {
    this.user = user;
    localStorage.setItem('dove-user', JSON.stringify(this.user));
  }

  loadFromStorage() {
    let saved = localStorage.getItem('dove-user');
    this.user = saved ? JSON.parse(saved as string) : null;
    let settings = localStorage.getItem('dove-settings');
    if (settings) {
      this.settings = JSON.parse(settings as string);
    } else {
      this.updateSettings(new UserSettings());
    }
  }

  updateSettings(settings: UserSettings) {
    this.settings = settings;
    localStorage.setItem('dove-settings', JSON.stringify(this.settings));
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

export class UserSettings {

  camera: string;

}