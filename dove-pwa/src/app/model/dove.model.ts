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

}

export class SchedaOggetto {
    tipo: string;
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
