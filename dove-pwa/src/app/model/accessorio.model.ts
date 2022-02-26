import { SchedaAccessorioViewComponent } from "../components/schede/scheda-accessorio-view/scheda-accessorio-view.component";
import { FilterSchedaOggetto, SchedaOggetto, SchedaOggettoProto, TreeNodeData } from "./dove.model";

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
        this.tipo = 'accessorio';
    }
}
SchedaOggetto.component['accessorio'] = SchedaAccessorioViewComponent;
SchedaOggetto.protos.push(new SchedaOggettoProto("Accessorio", new SchedaAccessorio()));
SchedaOggetto.nameResolver['accessorio'] = (oggetto) => accessorioTreeNode.findTreeNode((oggetto as SchedaAccessorio).accessorio).label || 'Accessorio';

export class FilterSchedaAccessorio extends FilterSchedaOggetto {

    static KEY = 'accessorio';

    constructor() {
        super(FilterSchedaAccessorio.KEY);
        FilterSchedaOggetto.filters[FilterSchedaAccessorio.KEY] = this;
    }

}