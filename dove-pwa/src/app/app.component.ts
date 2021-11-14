import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRestService } from './services/auth-rest.service';
import { MenuButton, MenuButtonsService } from './services/menu-buttons.service';
import { SharedDataService } from './services/shared-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public menu: MenuButtonsService,
    public shared: SharedDataService,
    public auth: AuthRestService,
    private router: Router,
  ) {
    this.menu.buttons.push(new MenuButton('Q', () => {
      console.log('you clicked me?', this);
      this.router.navigate(['oggetto', 'f2980be0-5c25-4540-bf07-78c7c2a6bdba']);
    }));
  }

}
