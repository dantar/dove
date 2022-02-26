import { SchedaScatolaFilterComponent } from "../components/schede/scheda-scatola-filter/scheda-scatola-filter.component";
import { SchedaScatolaViewComponent } from "../components/schede/scheda-scatola-view/scheda-scatola-view.component";
import { SchedaOggetto, SchedaOggettoProto } from "./dove.model";

const KEY = 'scatola';

export class SchedaScatola extends SchedaOggetto {
    scatola: string;
    contenuti: ContenutoScatola[];
    descrizione: string;
    note: string;
    constructor() {
        super();
        this.tipo = KEY;
    }
    static fix(scheda: SchedaScatola) {
      if (!scheda.contenuti) {
          scheda.contenuti = [];
      }
    }
    static register() {
        SchedaOggetto.filter[KEY] = SchedaScatolaFilterComponent;
        SchedaOggetto.view[KEY] = SchedaScatolaViewComponent;
        SchedaOggetto.protos.push(new SchedaOggettoProto("Scatola", new SchedaScatola()));
        SchedaOggetto.nameResolver[KEY] = (oggetto) => `Scatola ${(oggetto as SchedaScatola).contenuti.length} cose`;
    }
}
SchedaOggetto.registers.push(SchedaScatola.register)

export class ContenutoScatola {
    tipo: string;
    static protos: {[id:string]: () => ContenutoScatola} = {};
}

export class ContenutoScatolaVestiti extends ContenutoScatola {
    sesso: 'maschio'|'femmina'|'unisex';
    stagione: 'estate'|'inverno' [];
    eta: '0'|'3m'|'6m'|'9m'|'12m'|'18m'|'3a'|'4a'|'5a'|'6a+' [];
    static options = {
        sesso: ['maschio','femmina','unisex'],
        stagione: ['estate','inverno'],
        eta: ['0','3m','6m','9m','12m','18m','3a','4a','5a','6a+'],
    };
    constructor() {
        super();
        this.tipo = 'vestiti';
        this.sesso = 'unisex';
        this.stagione = [];
        this.eta = [];
    }
}
ContenutoScatola.protos['vestiti'] = () => new ContenutoScatolaVestiti();

