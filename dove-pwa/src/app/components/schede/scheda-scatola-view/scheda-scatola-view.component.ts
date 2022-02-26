import { Component, Input, OnInit } from '@angular/core';
import { ContenutoScatola, ContenutoScatolaVestiti, SchedaScatola } from 'src/app/model/dove.model';
import { SchedaViewInterface } from '../../interfaces/scheda-view-interface';

@Component({
  selector: '[app-scheda-scatola-view]',
  templateUrl: './scheda-scatola-view.component.html',
  styleUrls: ['./scheda-scatola-view.component.scss']
})
export class SchedaScatolaViewComponent implements OnInit, SchedaViewInterface {

  @Input() scheda: SchedaScatola;
  @Input() editable: boolean;
  @Input() mode: 'full'|'short'|'list' = 'full';

  additems = [
    {label: 'vestiti', command: () => { console.log('vestiti') }},
    {label: 'body', command: () => { console.log('body') }},
    {label: 'canottiere', command: () => { console.log('canottiere') }},
  ];

  constructor() { }

  ngOnInit(): void {
    SchedaScatola.fix(this.scheda);
  }

  addItem(tipo: string) {
    this.scheda.contenuti.push(ContenutoScatola.protos[tipo]());
  }

  vestitiDelete(content: ContenutoScatola) {
    if (this.scheda.contenuti.includes(content)) {
      this.scheda.contenuti.splice(this.scheda.contenuti.indexOf(content), 1);
    }
  }

  vestitiSessoChips(vestiti: ContenutoScatolaVestiti): ChipsWrapper[] {
    return ChipsWrapper.wrap(ContenutoScatolaVestiti.options.sesso, vestiti.sesso ? [vestiti.sesso as string] : []);
  }

  vestitiStagioneChips(vestiti: ContenutoScatolaVestiti): ChipsWrapper[] {
    return ChipsWrapper.wrap(ContenutoScatolaVestiti.options.stagione, vestiti.stagione as string[]);
  }

  vestitiEtaChips(vestiti: ContenutoScatolaVestiti): ChipsWrapper[] {
    return ChipsWrapper.wrap(ContenutoScatolaVestiti.options.eta, vestiti.eta as string[]);
  }

  keyupEnter(event: any) {
    if (event.target && event.target.blur) event.target.blur();
  }

}

export class ChipsWrapper {

  text: string;
  selected: boolean;
  values: string[];
  options: string[];

  constructor(options: string[], text: string, values: string[]) {
    this.text = text;
    this.values = values;
    this.options = options;
    this.selected = this.values.includes(this.text);
  }

  static wrap(options: string[], values: string[]): ChipsWrapper[] {
    return options.map(o => new ChipsWrapper(options, o, values));
  }

  toggle() {
    let index = this.values.indexOf(this.text);
    if (index >= 0) {
      this.values.splice(index, 1);
      this.selected = false;
    } else {
      let sorted = this.options.filter(o => (o === this.text) || this.values.includes(o));
      this.values.splice(sorted.indexOf(this.text), 0, this.text);
      this.selected = true;
    }
  }

  select(): string {
    this.values.splice(0, this.values.length, this.text);
    return this.text;
  }

}