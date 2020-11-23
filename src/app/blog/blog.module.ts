import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SharedBlogModule } from './shared-blog.module';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogOverviewComponent } from './blog-overview/blog-overview.component';
import { PostViewComponent } from './post-view/post-view.component';

@NgModule({
  declarations: [
    BlogOverviewComponent,
    PostViewComponent,
  ],
  imports: [
    SharedModule,
    SharedBlogModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
