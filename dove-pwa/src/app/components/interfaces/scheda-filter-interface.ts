import { OnInit } from "@angular/core";
import { Oggetto } from "src/app/model/dove.model";

export interface SchedaFilterInterface extends OnInit {

    filter(lista: Oggetto[]): Oggetto[];

}