import { NgModule } from '@angular/core';
import { SharedBlogModule } from '../shared-blog.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminOverviewComponent } from '../../admin-overview/admin-overview.component';
import { AdminComponent } from './admin.component';
import { LoginFormComponent } from './login-form.component';

import { PostEditComponent } from '../post-edit/post-edit.component';
@NgModule({
  imports: [
    SharedBlogModule,
    AdminRoutingModule,
  ],
  declarations: [
    AdminComponent,
    LoginFormComponent,
    AdminOverviewComponent,
    PostEditComponent
  ]
})
export class AdminModule { }
