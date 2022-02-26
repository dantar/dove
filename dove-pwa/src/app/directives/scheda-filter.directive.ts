import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appSchedaFilter]'
})
export class SchedaFilterDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }

}
