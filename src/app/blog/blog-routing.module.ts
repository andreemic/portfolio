import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {BlogOverviewComponent} from './blog-overview/blog-overview.component';
import {PostViewComponent} from './post-view/post-view.component';


const routes: Routes = [
  { path: '', component: BlogOverviewComponent, pathMatch: 'full'},
  { path: 'post/:pid', component: PostViewComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }

