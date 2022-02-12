import { SchedaOggetto } from "src/app/model/dove.model";

export interface SchedaViewInterface {
    scheda: SchedaOggetto;
    editable: boolean;
    mode: 'full'|'short'|'list';
}