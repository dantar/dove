import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuButtonsService {

  buttons: MenuButton[] = [];

  constructor() { }

}

export class MenuButton {

  letter: string;
  trigger: () => void;
  constructor(letter: string, trigger: () => void) {
    this.letter = letter;
    this.trigger = trigger;
  }
}