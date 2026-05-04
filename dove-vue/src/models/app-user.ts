import type { TipoSchedaOggetto } from "@/stores/schede-by-schema";
import type { PostoObj } from "./browse-item";

export class RepoAccessObj {
    constructor(root: PostoObj, schemi: TipoSchedaOggetto[]) {
        this.root = root;
        this.schemi = schemi;
    }
    root: PostoObj;
    schemi: TipoSchedaOggetto[];
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
        result.repos = data.repos.map((r:any) => ({
            root: r.root,
            schemi: r.schemi.schemi,
        }));
        return result;
    }
    
}
