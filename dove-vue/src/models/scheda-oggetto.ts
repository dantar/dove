export interface SchedaCampo {
    tipo: string;
    span: number;
}

export interface SchedaCampoStringa extends SchedaCampo {
    tipo: 'string';
    span: 4;
}

export interface SchedaCampoText extends SchedaCampo {
    tipo: 'text';
    span: 0;
}
