import { ref } from 'vue'
import { defineStore } from 'pinia'
import { SchedaBySchema, SchedaOggetto } from '@/models/browse-item';

export interface TipoSchedaOggetto {

    id: string;
    nome: string;
    campi: SchedaOggettoCampo[];

}

export interface SchedaOggettoCampoBase {
    tipo: string;
    id: string;
    nome: string;
    span: number;
}

export interface SchedaOggettoCampoStars extends SchedaOggettoCampoBase {
    tipo: 'stars';
    span: 3;
    max: number;
}
export interface SchedaOggettoCampoHandler {
    KEY: string;
    owns(campo: SchedaOggettoCampo): boolean;
    digest(campo: SchedaOggettoCampo): SchedaOggettoCampo;
    initScheda(scheda: SchedaBySchema, campo: SchedaOggettoCampo): void;
    registration: boolean;
}
export class SchedaOggettoCampoStarsHandler {
    static KEY = 'stars';
    static registration = SchedaBySchema.addHandler(this);
    static owns(campo: SchedaOggettoCampo): boolean {
        return campo.tipo == SchedaOggettoCampoStarsHandler.KEY;
    }
    static digest(campo: SchedaOggettoCampo): SchedaOggettoCampoStars {
        return campo as SchedaOggettoCampoStars;
    }
    static initScheda(scheda: SchedaBySchema, campo: SchedaOggettoCampoStars): void {
        scheda.values[campo.id] = 3;
    }
}

export interface SchedaOggettoCampoChips extends SchedaOggettoCampoBase {
    tipo: 'chips';
    span: 0;
    opzioni: string[];
}
export class SchedaOggettoCampoChipsHandler {
    static KEY = 'chips';
    static registration = SchedaBySchema.addHandler(this);
    static owns(campo: SchedaOggettoCampo): boolean {
        return campo.tipo == SchedaOggettoCampoChipsHandler.KEY;
    }
    static digest(campo: SchedaOggettoCampo): SchedaOggettoCampoChips {
        return campo as SchedaOggettoCampoChips;
    }
    static initScheda(scheda: SchedaBySchema, campo: SchedaOggettoCampoChips): void {
        scheda.values[campo.id] = [];
    }
}

export interface SchedaOggettoCampoText extends SchedaOggettoCampoBase {
    tipo: 'text';
    span: 0;
}
export class SchedaOggettoCampoTextHandler {
    static KEY = 'text';
    static registration = SchedaBySchema.addHandler(this);
    static owns(campo: SchedaOggettoCampo): boolean {
        return campo.tipo == SchedaOggettoCampoTextHandler.KEY;
    }
    static digest(campo: SchedaOggettoCampo): SchedaOggettoCampoText {
        return campo as SchedaOggettoCampoText;
    }
    static initScheda(scheda: SchedaBySchema, campo: SchedaOggettoCampoText): void {
        scheda.values[campo.id] = '';
    }
}

export type SchedaOggettoCampo =
  | SchedaOggettoCampoStars
  | SchedaOggettoCampoChips
  | SchedaOggettoCampoText;
  
export const useTipiSchedeOggetto = defineStore('tipiSchedeOggetto', () => {
  const tipi = ref<TipoSchedaOggetto[]>([]);
  tipi.value.push(
    { id: 'accessorio', nome: 'Accessorio', campi: [
        {id: 'stato', nome: 'Stato', tipo: 'stars', span: 3, max: 5},
        {id: 'descrizione', nome: 'Descrizione', tipo: 'text', span: 0},
        {id: 'note', nome: 'Note', tipo: 'text', span: 0},
    ]}
  );

  tipi.value.push(
    { id: 'vestiti', nome:'Vestiti', campi: [
        {id: 'eta', nome: 'Età', tipo: 'chips', span: 0, opzioni: [
            '0', '3m', '6m', '9m', '12m', '18m', '3a', '4a', '5a', '6a+'
        ]},
        {id: 'sesso', nome: 'Sesso', tipo: 'chips', span: 0, opzioni: [
            'unisex', 'maschio', 'femmina'
        ]},
        {id: 'stagione', nome: 'Stagione', tipo: 'chips', span: 0, opzioni: [
            'estate', 'inverno'
        ]},
    ]}
  );
  async function findSchema(id: string): Promise<TipoSchedaOggetto> {
    const a = tipi.value;
    if (a) {
        for (let index = 0; index < a.length; index++) {
            if (a[index]?.id == id) {
                return a[index] as TipoSchedaOggetto
            }
        }
    }
    throw new Error(`Schema ${id} non trovato`);
  }
  return { tipi, findSchema }
})
