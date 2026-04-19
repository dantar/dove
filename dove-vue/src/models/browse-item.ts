import type { SchedaOggettoCampoHandler, TipoSchedaOggetto } from "@/stores/schede-by-schema";

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
    repo: string;
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

export class SchedaBySchema extends SchedaOggetto {
    static KEY: string = 'by-schema';
    static handler: {[id:string]: SchedaOggettoCampoHandler} = {};
    static addHandler(h: SchedaOggettoCampoHandler): boolean {
        this.handler[h.KEY] = h;
        return true;
    }
    schema: string = '';
    values: {[id:string]: any} = {};
    constructor() {
        super(SchedaBySchema.KEY);
    }
    static init = (s: SchedaBySchema): SchedaBySchema => {
        s.tipo = SchedaBySchema.KEY;
        s.schema = '';
        s.values = {};
        return s;
    }
    static isThis = SchedaBySchema.makeIsThis(SchedaBySchema.KEY);
    static initWithSchema(schema: TipoSchedaOggetto, data: SchedaBySchema) {
      data.schema = schema.id;
      schema.campi.forEach(campo => {
        this.handler[campo.tipo]?.initScheda(data, campo);
      })
    }
}
SchedaOggetto.protos[SchedaBySchema.KEY] = (s?:SchedaOggetto) => SchedaBySchema.init(s ? s as SchedaBySchema : new SchedaBySchema());

// Browse

export interface PostoBrowseDto {
    repo: string;
    breadcrumbs: PostoObj[];
    posto: PostoObj;
    oggetti: OggettoObj[];
    posti: PostoObj[];
}

export interface OggettoBrowseDto {
    repo: string;
    breadcrumbs: PostoObj[];
    posto: PostoObj;
    oggetto: OggettoObj;
}
