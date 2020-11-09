import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { AdminComponent } from './admin/admin.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { BlogOverviewComponent } from './blog-overview/blog-overview.component';
import { PostViewComponent } from './post-view/post-view.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'blog', component: BlogOverviewComponent },
  { path: 'blog/:pid', component: PostViewComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: AdminOverviewComponent },
      { path: 'post/new', component: PostEditComponent },
      { path: 'post/:pid', component: PostEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
