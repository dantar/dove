import { ref } from 'vue'
import { defineStore } from 'pinia'

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
}

export interface SchedaOggettoCampoChips extends SchedaOggettoCampoBase {
    tipo: 'chips';
    span: 0;
    opzioni: string[];
}
export class SchedaOggettoCampoChipsHandler {
    static KEY = 'chips';
    static owns(campo: SchedaOggettoCampo): boolean {
        return campo.tipo == SchedaOggettoCampoChipsHandler.KEY;
    }
    static digest(campo: SchedaOggettoCampo): SchedaOggettoCampoChips {
        return campo as SchedaOggettoCampoChips;
    }
}

export interface SchedaOggettoCampoText extends SchedaOggettoCampoBase {
    tipo: 'text';
    span: 0;
}
export class SchedaOggettoCampoTextHandler {
    static KEY = 'text';
    static owns(campo: SchedaOggettoCampo): boolean {
        return campo.tipo == SchedaOggettoCampoTextHandler.KEY;
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
        {id: 'stato', nome: 'Stato', tipo: 'stars', span: 3},
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
