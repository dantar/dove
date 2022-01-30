import { Component, Type } from "@angular/core";
import { SchedaAccessorioViewComponent } from "../components/schede/scheda-accessorio-view/scheda-accessorio-view.component";
import { SchedaScatolaViewComponent } from "../components/schede/scheda-scatola-view/scheda-scatola-view.component";

export class JwtUserData {
    token: string;
    details: JwtUserDetails;
}

export class JwtUserDetails {
    username: string;
    authorities: string[];
    utente: Utente;
}

export class Utente {
    id: string;
    username: string;
    password: string;
    hash: string;
}


export class Posto {

    id: string;
    nome: string;
    percorso: string;

}

export class Oggetto {

    id: string;
    idPosto: string;
    nome: string;
    scheda: SchedaOggetto;
    immagini: string[];

}

export class SchedaOggetto {
    static component: {[id:string]: Type<any>} = {};
    static protos: SchedaOggettoProto[] = [];
    tipo: string;
}
export class SchedaOggettoProto {
    proto: SchedaOggetto;
    nome: string;
    constructor(nome: string, proto: SchedaOggetto) {
        this.nome = nome;
        this.proto = proto;
    }
}

export class SchedaAccessorio extends SchedaOggetto {
    accessorio: string;
    condizioni: number;
    descrizione: string;
    note: string;
    constructor() {
        super();
        this.tipo = 'accessorio';
    }
}
SchedaOggetto.component['accessorio'] = SchedaAccessorioViewComponent;
SchedaOggetto.protos.push(new SchedaOggettoProto("Accessorio", new SchedaAccessorio()));

export class SchedaScatola extends SchedaOggetto {
    scatola: string;
    contenuti: ContenutoScatola[];
    descrizione: string;
    note: string;
    constructor() {
        super();
        this.tipo = 'scatola';
    }
}
SchedaOggetto.component['scatola'] = SchedaScatolaViewComponent;
SchedaOggetto.protos.push(new SchedaOggettoProto("Scatola", new SchedaScatola()));

export class ContenutoScatola {

}

export class PostoBrowse {

    breadcrumbs: Posto[];
    posto: Posto;
    posti: Posto[];
    oggetti: Oggetto[];

}

export class OggettoBrowse {

    breadcrumbs: Posto[];
    posto: Posto;
    oggetto: Oggetto;

}