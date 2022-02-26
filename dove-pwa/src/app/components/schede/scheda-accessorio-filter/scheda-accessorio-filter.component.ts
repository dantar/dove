import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { accessorioTreeNode, SchedaAccessorio } from 'src/app/model/accessorio.model';
import { Oggetto } from 'src/app/model/dove.model';
import { SchedaFilterInterface } from '../../interfaces/scheda-filter-interface';

@Component({
  selector: '[app-scheda-accessorio-filter]',
  templateUrl: './scheda-accessorio-filter.component.html',
  styleUrls: ['./scheda-accessorio-filter.component.scss']
})
export class SchedaAccessorioFilterComponent implements OnInit, SchedaFilterInterface {

  tipoTree: TreeNode[];
  tipoSelected: TreeNode | null;

  constructor(
  ) { }

  ngOnInit(): void {
    this.tipoTree = accessorioTreeNode.tipoTree;
  }

  filter(lista: Oggetto[]): Oggetto[] {
    return lista.filter(a => a.scheda.tipo === 'accessorio' && (!this.tipoSelected || 
      (a.scheda as SchedaAccessorio).accessorio === this.tipoSelected.data) );
  }

}
