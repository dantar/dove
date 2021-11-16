import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OggettoViewComponent } from './components/oggetto-view/oggetto-view.component';
import { PostoBrowseComponent } from './components/posto-browse/posto-browse.component';
import { PostoViewComponent } from './components/posto-view/posto-view.component';


const routes: Routes = [
  {path: 'posto/:id', component: PostoBrowseComponent},
  {path: 'oggetto/:id', component: OggettoViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
