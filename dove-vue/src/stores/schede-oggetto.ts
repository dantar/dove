import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface TipoSchedaOggetto {

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

export interface SchedaOggettoCampoText extends SchedaOggettoCampoBase {
    tipo: 'text';
    span: 0;
}

export type SchedaOggettoCampo =
  | SchedaOggettoCampoStars
  | SchedaOggettoCampoChips
  | SchedaOggettoCampoText;
  
export const useTipiSchedeOggetto = defineStore('tipiSchedeOggetto', () => {
  const tipi = ref<TipoSchedaOggetto[]>([
    { nome: 'accessorio', campi: [
        {id: 'stato', nome: 'Stato', tipo: 'stars', span: 3},
        {id: 'descrizione', nome: 'Descrizione', tipo: 'text', span: 0},
        {id: 'note', nome: 'Note', tipo: 'text', span: 0},
    ]},
    { nome: 'vestiti', campi: [
        {id: 'eta', nome: 'Età', tipo: 'chips', span: 0, opzioni: []},
        {id: 'sesso', nome: 'Sesso', tipo: 'chips', span: 0, opzioni: []},
        {id: 'stagione', nome: 'Stagione', tipo: 'chips', span: 0, opzioni: []},
    ]},
  ]);
  return { tipi }
})
