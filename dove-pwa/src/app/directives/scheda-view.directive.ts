import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appSchedaView]'
})
export class SchedaViewDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
