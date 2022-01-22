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
    this.menu.buttons.push(new MenuButton('P', () => {
      this.router.navigate(['posto', '149d624c-2c00-4590-9813-ab0c8ced81ff']);
    }));
    this.menu.buttons.push(new MenuButton('O', () => {
      console.log('you clicked me?', this);
      this.router.navigate(['oggetto', 'f2980be0-5c25-4540-bf07-78c7c2a6bdba']);
    }));
  }
  ngOnInit(): void {
    this.shared.loadUser();
  }

}
