import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OggettoBrowseComponent } from './components/oggetto-browse/oggetto-browse.component';
import { PostoBrowseComponent } from './components/posto-browse/posto-browse.component';
import { QrCodeBrokerComponent } from './components/qr-code-broker/qr-code-broker.component';
import { UserinfoComponent } from './components/userinfo/userinfo.component';


const routes: Routes = [
  {path: 'broker', component: QrCodeBrokerComponent},
  {path: 'root', component: PostoBrowseComponent},
  {path: 'posto/:id', component: PostoBrowseComponent},
  {path: 'oggetto/:id', component: OggettoBrowseComponent},
  {path: 'userinfo', component: UserinfoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
