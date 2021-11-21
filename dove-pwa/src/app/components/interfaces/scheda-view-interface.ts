import { EventEmitter } from "@angular/core";
import { SchedaOggetto } from "src/app/model/dove.model";

export interface SchedaViewInterface {
    scheda: SchedaOggetto;
    save: EventEmitter<SchedaOggetto>;
}