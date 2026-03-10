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
    scheda: Object;
    immagini: string[];
}

export interface PostoBrowseDto {
    breadcrumbs: PostoObj[];
    posto: PostoObj;
    oggetti: OggettoObj[];
    posti: PostoObj[];
}