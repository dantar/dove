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
import {ButtonModule} from 'primeng/button';

import { PostoViewComponent } from './components/posto-view/posto-view.component';
import { PostoBrowseComponent } from './components/posto-browse/posto-browse.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { OggettoBrowseComponent } from './components/oggetto-browse/oggetto-browse.component';
import { OggettoEditComponent } from './components/oggetto-edit/oggetto-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    OggettoViewComponent,
    PostoViewComponent,
    PostoBrowseComponent,
    LoginFormComponent,
    OggettoBrowseComponent,
    OggettoEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InputTextModule,
    HttpClientModule,
    FormsModule,
    ButtonModule,
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
