import { ref, type Component } from 'vue'
import { defineStore } from 'pinia'
import { SchedaBySchema } from '@/models/browse-item';
import SchedaOggettoCampoChipsView from '@/components/schemas/SchedaOggettoCampoChipsView.vue';
import SchedaOggettoCampoStarsView from '@/components/schemas/SchedaOggettoCampoStarsView.vue';
import SchedaOggettoCampoTextView from '@/components/schemas/SchedaOggettoCampoTextView.vue';
import { useBackendConfig } from './backend-config';
import axios from 'axios';

export interface RepoSchemiJson {
    id: string;
    schemi: TipoSchedaOggetto[];
}

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
    component(): Component;
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
    static component(): Component {
        return SchedaOggettoCampoStarsView;
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
    static component(): Component {
        return SchedaOggettoCampoChipsView;
    }
}

export interface SchedaOggettoCampoViewProps {
    // queste sono le prop richieste da ogni Componente di view
    scheda: SchedaBySchema,
    editable: boolean,
    saving: boolean,
    form: SchedaBySchema,
    campo: SchedaOggettoCampo, // da specializzare in ogni classe
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
    static component(): Component {
        return SchedaOggettoCampoTextView;
    }
}

export type SchedaOggettoCampo =
    | SchedaOggettoCampoStars
    | SchedaOggettoCampoChips
    | SchedaOggettoCampoText;

export const useTipiSchedeOggetto = defineStore('tipiSchedeOggetto', () => {

    const tipiByRepo = ref<RepoSchemiJson[]>([]);
    const loaded = ref(false);

    async function init() {
        const config = useBackendConfig();
        const response = await axios
            .get<RepoSchemiJson[]>(`${config.backend}/schema/list`);
        tipiByRepo.value = response.data;
    }

    async function findSchema(id: string): Promise<TipoSchedaOggetto> {
        for (let repo of tipiByRepo.value) {
            console.log('repo', repo);
            for (let schema of repo.schemi) {
                if (schema.id == id) return schema;
            }
        }
        throw new Error(`Schema ${id} non trovato`);
    }

    async function schemiByRepo(id: string): Promise<TipoSchedaOggetto[]> {
        for (let repo of tipiByRepo.value) {
            if (repo.id == id) return repo.schemi;
        }
        throw new Error(`Repo ${id} non trovato in`);
    }

    init()
    .then(() => {
        loaded.value = true;
    })

    return { tipiByRepo, findSchema, schemiByRepo }
})
