import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OggettoBrowseComponent } from './components/oggetto-browse/oggetto-browse.component';
import { PostoBrowseComponent } from './components/posto-browse/posto-browse.component';


const routes: Routes = [
  {path: 'posto/:id', component: PostoBrowseComponent},
  {path: 'oggetto/:id', component: OggettoBrowseComponent},
  {path: 'userinfo', component: OggettoBrowseComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
