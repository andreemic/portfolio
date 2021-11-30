import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';
import { ImpressumComponent } from './impressum/impressum.component';
import {AdminComponent} from './blog/admin/admin.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'impressum', component: ImpressumComponent },
  // { path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) },
  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'blog', pathMatch: 'full'},
      {
        path: 'blog',
        loadChildren: () =>
          import('./blog/admin/admin.module')
            .then(m => m.AdminModule)}
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
