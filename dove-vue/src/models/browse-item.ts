export interface PostoObj {
    id: string;
    nome: string;
    percorso: string;
    pathId: string;
}

export interface OggettoObj {
    id: string;
    idPosto: string;
    nome: string;
    thumbnail: string;
    scheda: SchedaOggetto;
    immagini: string[];
}

export interface PostoBrowseDto {
    breadcrumbs: PostoObj[];
    posto: PostoObj;
    oggetti: OggettoObj[];
    posti: PostoObj[];
}

export interface OggettoBrowseDto {
    breadcrumbs: PostoObj[];
    posto: PostoObj;
    oggetto: OggettoObj;
}


export class SchedaOggetto {
    tipo: string;
    constructor(t: string) {
        this.tipo = t;
    }
    static protos: {[id:string]: () => SchedaOggetto} = {};
    static makeIsThis(key:string) {
        return (so:SchedaOggetto) => so.tipo && so.tipo == key;
    }
}

export class SchedaAccessorio extends SchedaOggetto {
    condizioni: number;
    descrizione: string;
    note: string;
    constructor() {
        super('accessorio');
        this.condizioni = 3;
        this.descrizione = '';
        this.note = '';
    }
    public static isThis = SchedaOggetto.makeIsThis('accessorio');
}
SchedaOggetto.protos['accessorio'] = () => new SchedaAccessorio();

export class SchedaVestiti extends SchedaOggetto {
    sesso: 'unisex'|'maschio'|'femmina' [];
    stagione: 'estate'|'inverno' [];
    eta: '0'|'3m'|'6m'|'9m'|'12m'|'18m'|'3a'|'4a'|'5a'|'6a+' [];
    static options = {
        sesso: ['maschio','femmina','unisex'],
        stagione: ['estate','inverno'],
        eta: ['0','3m','6m','9m','12m','18m','3a','4a','5a','6a+'],
    };
    constructor() {
        super('vestiti');
        this.sesso = [];
        this.stagione = [];
        this.eta = [];
    }
    static isThis = SchedaOggetto.makeIsThis('vestiti');
}
SchedaOggetto.protos['vestiti'] = () => new SchedaVestiti();
