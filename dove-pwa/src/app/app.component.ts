import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRestService } from './services/auth-rest.service';
import { MenuButton, MenuButtonsService } from './services/menu-buttons.service';
import { SharedDataService } from './services/shared-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    public menu: MenuButtonsService,
    public shared: SharedDataService,
    public auth: AuthRestService,
    private router: Router,
  ) {
    this.menu.buttons.push(new MenuButton('B', () => {
      this.router.navigate(['broker']);
    }));
    this.menu.buttons.push(new MenuButton('U', () => {
      this.router.navigate(['userinfo']);
    }));
  }
  ngOnInit(): void {
    this.shared.loadUser();
  }

}
