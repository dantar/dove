import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SchedaOggetto } from './model/dove.model';
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

    SchedaOggetto.registerall();

    this.menu.buttons.push(new MenuButton('Q', () => {
      this.router.navigate(['broker']);
    }));
    this.menu.buttons.push(new MenuButton('R', () => {
      this.router.navigate(['root']);
    }));
    this.menu.buttons.push(new MenuButton('U', () => {
      this.router.navigate(['userinfo']);
    }));
    this.menu.buttons.push(new MenuButton('A', () => {
      this.router.navigate(['list', 'accessorio']);
    }));
  }
  
  ngOnInit(): void {
    this.shared.loadFromStorage();
    if (this.shared.user) {
      this.auth.getUser().subscribe({
        next: details => {
          this.shared.setDetails(details);
        },
        error: error => {
          if (error.status === 401) {
            this.shared.noUser();
          }
        }
      });
    }
  }

}
