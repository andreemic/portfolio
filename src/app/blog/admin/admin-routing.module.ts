import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PostEditComponent} from '../post-edit/post-edit.component';
import {AdminOverviewComponent} from '../../admin-overview/admin-overview.component';
import {AdminComponent} from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {path: '', component: AdminOverviewComponent},
      {path: 'post/new', component: PostEditComponent},
      {path: 'post/:pid', component: PostEditComponent},
      {path: '**', redirectTo: '/admin/blog'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

