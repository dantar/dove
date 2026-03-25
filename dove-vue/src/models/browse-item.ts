export interface AnyBrowseDto {
    breadcrumbs: PostoObj[];
    posto: PostoObj;
    oggetto: OggettoObj;
    oggetti: OggettoObj[];
    posti: PostoObj[];
}

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

export interface AnyObj {
    id: string;
    tipo: string;
    posto: PostoObj;
    oggetto: OggettoObj;
}

export class SchedaOggetto {
    tipo: string;
    constructor(t: string) {
        this.tipo = t;
    }
    static protos: {[id:string]: (scheda?: SchedaOggetto) => SchedaOggetto} = {};
    static makeIsThis(key:string) {
        return (so:SchedaOggetto) => so.tipo && so.tipo == key;
    }
}

export class SchedaAccessorio extends SchedaOggetto {
    condizioni: number = 3;
    descrizione: string = '';
    note: string = '';
    constructor() {
        super('accessorio');
    }
    static init = (s: SchedaAccessorio): SchedaAccessorio => {
        s.tipo = 'accessorio';
        s.condizioni = 3;
        s.descrizione = '';
        s.note = '';
        return s;
    }
    static isThis = SchedaOggetto.makeIsThis('accessorio');
}
SchedaOggetto.protos['accessorio'] = (s?:SchedaOggetto) => SchedaAccessorio.init(s ? s as SchedaAccessorio : new SchedaAccessorio());

export class SchedaVestiti extends SchedaOggetto {
    sesso: ('unisex'|'maschio'|'femmina') [] = [];
    stagione: ('estate'|'inverno') [] = [];
    eta: ('0'|'3m'|'6m'|'9m'|'12m'|'18m'|'3a'|'4a'|'5a'|'6a+') [] = [];
    static options = {
        sesso: ['maschio','femmina','unisex'],
        stagione: ['estate','inverno'],
        eta: ['0','3m','6m','9m','12m','18m','3a','4a','5a','6a+'],
    };
    constructor() {
        super('vestiti');
    }
    static init = (s: SchedaVestiti): SchedaVestiti => {
        s.tipo = 'vestiti';
        s.sesso = [];
        s.stagione = [];
        s.eta = [];
        return s;
    }
    static isThis = SchedaOggetto.makeIsThis('vestiti');
}
SchedaOggetto.protos['vestiti'] = (s?:SchedaOggetto) => SchedaVestiti.init(s ? s as SchedaVestiti : new SchedaVestiti());

// Browse

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
