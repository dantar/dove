import { Component, Type } from "@angular/core";
import { TreeNode } from "primeng/api";
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
    thumbnail: string;

}

export class SchedaOggetto {
    static component: {[id:string]: Type<any>} = {};
    static protos: SchedaOggettoProto[] = [];
    tipo: string;
    static nameResolver: {[id: string]: (oggetto:SchedaOggetto) => string} = {};
    static nomeOf(oggetto: Oggetto): string {
      if (oggetto.nome) return oggetto.nome;
      return this.nameResolver[oggetto.scheda.tipo](oggetto.scheda);
    }
}
export class SchedaOggettoProto {
    proto: SchedaOggetto;
    nome: string;
    constructor(nome: string, proto: SchedaOggetto) {
        this.nome = nome;
        this.proto = proto;
    }
}

export class FilterSchedaOggetto {

    static filters: {[id:string]: FilterSchedaOggetto} = {};
    static component: {[id:string]: Type<any>} = {};
    tipo: string;

    constructor(tipo: string) {
        this.tipo = tipo;
    }

    filter(scheda: SchedaOggetto): boolean {
        return scheda.tipo == this.tipo;
    }

}

export class TreeNodeData {

    tipoTree: TreeNode[];

    constructor(tree: TreeNode[]) {
        this.tipoTree = tree;
    }

    findTreeNode(value: string): TreeNode {
        return this._findTreeNodeRecursive(value, this.tipoTree);
    }

    private _findTreeNodeRecursive(value: string, nodes: TreeNode[]): TreeNode {
        if (nodes.length === 0) {
            return {label: 'undefined'} as TreeNode;
        }
        let found = nodes.filter(n => n.data === value);
        if (found.length > 0) {
        return found[0];
        } else {
        return this._findTreeNodeRecursive(value, nodes.flatMap(n => n.children ? n.children : []));
        }
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
    static fix(scheda: SchedaScatola) {
      if (!scheda.contenuti) {
          scheda.contenuti = [];
      }
    }
}
SchedaOggetto.component['scatola'] = SchedaScatolaViewComponent;
SchedaOggetto.protos.push(new SchedaOggettoProto("Scatola", new SchedaScatola()));
SchedaOggetto.nameResolver['scatola'] = (oggetto) => `Scatola ${(oggetto as SchedaScatola).contenuti.length} cose`;

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
