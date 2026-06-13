import type { TipoSchedaOggetto } from "@/stores/schede-by-schema";
import type { PostoObj } from "./browse-item";

export class RepoAccessObj {
    constructor(root: PostoObj, schemi: TipoSchedaOggetto[], checkout: TipoSchedaOggetto[]) {
        this.root = root;
        this.schemi = schemi;
        this.checkout = checkout;
    }
    root: PostoObj;
    schemi: TipoSchedaOggetto[];
    checkout: TipoSchedaOggetto[];
}

export class AppUserDto {

    constructor() {
        this.username = '';
        this.authorities = [];
        this.repos = [];
    }
    username: string;
    authorities: string[];
    repos: RepoAccessObj[];

    public static digestResponseData(data: any): AppUserDto {
        const result = new AppUserDto();
        result.username = data.username;
        result.authorities = data.authorities.map((a:any) => a.authority);
        result.repos = data.repos.map((r:any) => new RepoAccessObj(
            r.root, 
            r.repo.schemi, 
            r.repo.checkout));
        return result;
    }
    
}
