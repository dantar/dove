import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem, TreeNode } from 'primeng/api';
import { SchedaAccessorio, SchedaOggetto } from 'src/app/model/dove.model';
import { SchedaViewInterface } from '../../interfaces/scheda-view-interface';

@Component({
  selector: '[app-scheda-accessorio-view]',
  templateUrl: './scheda-accessorio-view.component.html',
  styleUrls: ['./scheda-accessorio-view.component.scss']
})
export class SchedaAccessorioViewComponent implements OnInit, SchedaViewInterface {

  @Input() scheda: SchedaAccessorio;
  @Input() editable: boolean;
  @Input() mode: 'full'|'short'|'list' = 'full';

  tipoSelected: TreeNode | null;

  tipoTree: TreeNode[] = [
    {data: 'passeggino', label:'Passeggino', children: [
      {data: 'passeggino-doppio-fila', label: 'Passeggino doppio in fila'},
      {data: 'passeggino-doppio-affiancato', label: 'Passeggino doppio affiancato'},
    ]},
    {data: 'seggiolone', label: 'Seggiolone', children: [
      {data: 'seggiolone-piccoli', label: 'Seggiolone bimbi piccoli'},
      {data: 'seggiolone-grandi', label: 'Seggiolone bimbi grandi'},
    ]},
  ];

  constructor() { }

  ngOnInit(): void {
    this.tipoSelected = this.scheda.accessorio ? this.findTreeNode(this.scheda.accessorio) : null;
  }

  tipoSelect(event: any) {
    console.log(event);
    let node: TreeNode = event.node;
    this.scheda.accessorio = node.data;
  }

  findTreeNode(value: string): TreeNode | null {
    return this.findTreeNodeRecursive(value, this.tipoTree);
  }

  findTreeNodeRecursive(value: string, nodes: TreeNode[]): TreeNode | null {
    if (nodes.length === 0) {
      return null;
    }
    let found = nodes.filter(n => n.data === value);
    if (found.length > 0) {
      return found[0];
    } else {
      return this.findTreeNodeRecursive(value, nodes.flatMap(n => n.children ? n.children : []));
    }
  }

}

