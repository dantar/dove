import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { accessorioTreeNode, SchedaAccessorio } from 'src/app/model/accessorio.model';
import { Oggetto } from 'src/app/model/dove.model';

@Component({
  selector: '[app-scheda-accessorio-filter]',
  templateUrl: './scheda-accessorio-filter.component.html',
  styleUrls: ['./scheda-accessorio-filter.component.scss']
})
export class SchedaAccessorioFilterComponent implements OnInit {

  tipoTree: TreeNode[];
  tipoSelected: TreeNode | null;

  constructor(
  ) { }

  ngOnInit(): void {
    this.tipoTree = accessorioTreeNode.tipoTree;
  }

  filter(lista: Oggetto[]): Oggetto[] {
    return lista.filter(a => !this.tipoSelected || 
      (a.scheda.tipo === 'accessorio' && (a.scheda as SchedaAccessorio).accessorio === this.tipoSelected.data) );
  }

}
