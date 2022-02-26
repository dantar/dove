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
    static view: {[id:string]: Type<any>} = {};
    static filter: {[id:string]: Type<any>} = {};
    static protos: {[id:string]: SchedaOggettoProto} = {};
    static registers: (()=>void)[] = [];
    tipo: string;
    static nameResolver: {[id: string]: (oggetto:SchedaOggetto) => string} = {};
    static nomeOf(oggetto: Oggetto): string {
      if (oggetto.nome) return oggetto.nome;
      return this.nameResolver[oggetto.scheda.tipo](oggetto.scheda);
    }
    static registerall() {
        SchedaOggetto.registers.forEach(r => r());
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

export class Ordine {
    id: string;
    idCliente: string;
    stato: string;
}

export class Cliente {
    id: string;
    nome: string;
}

export class OggettoOrdine {
    id: string;
    idOggetto: string;
    idOrdine: string;
    stato: string;
}

export class OggettoInOrdine {
    oggetto: Oggetto;
    relazione: OggettoOrdine;
}

export class OrdineBrowse {

    ordine: Ordine;
    cliente: Cliente;
    oggetti: OggettoInOrdine[];

    constructor() {
        this.oggetti = [];
    }

}