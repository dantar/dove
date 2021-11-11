import { Component } from '@angular/core';
import { MenuButton, MenuButtonsService } from './services/menu-buttons.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public menu: MenuButtonsService,
  ) {
    this.menu.buttons.push(new MenuButton('Q', () => {
      console.log('you clicked me?', this);
    }));
  }

}
