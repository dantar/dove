import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { OggettoViewComponent } from './components/oggetto-view/oggetto-view.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import {InputTextModule} from 'primeng/inputtext';
import {SliderModule} from 'primeng/slider';
import {ButtonModule} from 'primeng/button';
import {DataViewModule} from 'primeng/dataview';
import {TreeSelectModule} from 'primeng/treeselect';

import { PostoViewComponent } from './components/posto-view/posto-view.component';
import { PostoBrowseComponent } from './components/posto-browse/posto-browse.component';

import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { OggettoBrowseComponent } from './components/oggetto-browse/oggetto-browse.component';
import { OggettoEditComponent } from './components/oggetto-edit/oggetto-edit.component';
import { SchedaViewDirective } from './directives/scheda-view.directive';
import { SchedaViewComponent } from './components/scheda-view/scheda-view.component';
import { SchedaScatolaViewComponent } from './components/schede/scheda-scatola-view/scheda-scatola-view.component';
import { SchedaAccessorioViewComponent } from './components/schede/scheda-accessorio-view/scheda-accessorio-view.component';
import { QrCodePopupComponent } from './components/qr-code-popup/qr-code-popup.component';
import { CameraPopupComponent } from './components/camera-popup/camera-popup.component';
import { UserinfoComponent } from './components/userinfo/userinfo.component';
import { QrCodeBrokerComponent } from './components/qr-code-broker/qr-code-broker.component';
import { PaginatorModule } from 'primeng/paginator';
import { ListAccessorioComponent } from './components/list-accessorio/list-accessorio.component';
import { ListOggettoComponent } from './components/list-oggetto/list-oggetto.component';
import { OggettoThumbnailComponent } from './components/oggetto-thumbnail/oggetto-thumbnail.component';

@NgModule({
  declarations: [
    AppComponent,
    OggettoViewComponent,
    PostoViewComponent,
    PostoBrowseComponent,
    LoginFormComponent,
    OggettoBrowseComponent,
    OggettoEditComponent,
    SchedaViewDirective,
    SchedaViewComponent,
    SchedaScatolaViewComponent,
    SchedaAccessorioViewComponent,
    QrCodePopupComponent,
    CameraPopupComponent,
    UserinfoComponent,
    QrCodeBrokerComponent,
    ListAccessorioComponent,
    ListOggettoComponent,
    OggettoThumbnailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InputTextModule,
    HttpClientModule,
    FormsModule,
    ButtonModule,
    SliderModule,
    DataViewModule,
    PaginatorModule,
    TreeSelectModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
