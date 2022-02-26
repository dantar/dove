import { Component, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { SchedaViewInterface } from '../../interfaces/scheda-view-interface';
import { accessorioTreeNode, SchedaAccessorio } from 'src/app/model/accessorio.model';

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

