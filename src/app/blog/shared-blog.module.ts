import { NgModule } from '@angular/core';

import { PostPreviewComponent } from './post-preview/post-preview.component';
import { QuillModule, QuillService } from 'ngx-quill';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PostPreviewComponent],
  imports: [SharedModule, QuillModule.forRoot()],
  exports: [PostPreviewComponent, QuillModule, SharedModule],
})
export class SharedBlogModule {}
