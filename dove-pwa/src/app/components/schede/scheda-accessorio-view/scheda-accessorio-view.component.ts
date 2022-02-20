import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem, TreeNode } from 'primeng/api';
import { accessorioTreeNode, SchedaAccessorio, SchedaOggetto, TreeNodeData } from 'src/app/model/dove.model';
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
  tipoTree: TreeNode[];

  constructor() { }

  ngOnInit(): void {
    this.tipoTree = accessorioTreeNode.tipoTree;
    this.tipoSelected = this.scheda.accessorio ? accessorioTreeNode.findTreeNode(this.scheda.accessorio) : null;
  }

  tipoSelect(event: any) {
    console.log(event);
    let node: TreeNode = event.node;
    this.scheda.accessorio = node.data;
  }

  keyupEnter(event: any) {
    if (event.target && event.target.blur) event.target.blur();
  }

}

