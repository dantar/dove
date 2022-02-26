import { SchedaAccessorioFilterComponent } from "../components/schede/scheda-accessorio-filter/scheda-accessorio-filter.component";
import { SchedaAccessorioViewComponent } from "../components/schede/scheda-accessorio-view/scheda-accessorio-view.component";
import { SchedaOggetto, SchedaOggettoProto, TreeNodeData } from "./dove.model";

const KEY = 'accessorio';

export let accessorioTreeNode = new TreeNodeData(
    [
        {data: 'passeggino', label:'Passeggino', children: [
          {data: 'passeggino-doppio-fila', label: 'Passeggino doppio in fila'},
          {data: 'passeggino-doppio-affiancato', label: 'Passeggino doppio affiancato'},
        ]},
        {data: 'seggiolone', label: 'Seggiolone', children: [
          {data: 'seggiolone-piccoli', label: 'Seggiolone bimbi piccoli'},
          {data: 'seggiolone-grandi', label: 'Seggiolone bimbi grandi'},
        ]},
    ]    
);

export class SchedaAccessorio extends SchedaOggetto {
    accessorio: string;
    condizioni: number;
    descrizione: string;
    note: string;
    constructor() {
        super();
        this.tipo = KEY;
    }
    static register() {
        SchedaOggetto.filter[KEY] = SchedaAccessorioFilterComponent;
        SchedaOggetto.view[KEY] = SchedaAccessorioViewComponent;
        SchedaOggetto.protos[KEY] = new SchedaOggettoProto("Accessorio", new SchedaAccessorio());
        SchedaOggetto.nameResolver[KEY] = (oggetto) => accessorioTreeNode.findTreeNode((oggetto as SchedaAccessorio).accessorio).label || 'Accessorio';
    }
}
SchedaOggetto.registers.push(SchedaAccessorio.register)