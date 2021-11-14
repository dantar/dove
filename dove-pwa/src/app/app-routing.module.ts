import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OggettoViewComponent } from './components/oggetto-view/oggetto-view.component';


const routes: Routes = [
  {path: 'oggetto/:id', component: OggettoViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
