import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentContainerComponent } from './content-container/content-container.component';
import { ContentListComponent } from './content-list/content-list.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full',
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'blog', component: ContentListComponent,
  },
  {
    path: 'blog/:path', component: ContentContainerComponent
  },
  {
    path: '**', redirectTo: 'home'  //404 with chips sad panda in theme colors
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
