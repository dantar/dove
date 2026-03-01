export class PostoObj {
    id: string = '';
    nome: string = '';
    percorso: string = '';
    pathId: string = '';
}

export class OggettoObj {
    id: string = '';
    idPosto: string = '';
    nome: string = '';
    thumbnail: string = '';
    scheda: Object = {};
    immagini: string[] = [];
}

export class PostoBrowseDto {
    breadcrumbs: PostoObj[] = [];
    posto: PostoObj = new PostoObj();
    oggetti: OggettoObj[] = [];
    posti: PostoObj[] = [];
}