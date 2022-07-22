import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRippleModule } from '@angular/material/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ContentListComponent } from './content-list/content-list.component';
import { ContentContainerComponent } from './content-container/content-container.component';
import { HomeComponent } from './home/home.component';
import { PannelComponent } from './pannel/pannel.component';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    ContentListComponent,
    ContentContainerComponent,
    HomeComponent,
    PannelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatRippleModule,
    MarkdownModule.forRoot({loader: HttpClient}),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
