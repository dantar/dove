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
  ) {}

}

