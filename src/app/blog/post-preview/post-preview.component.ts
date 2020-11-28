import { Component, OnInit, Input } from '@angular/core';

import { Post } from '../blog-api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss'],
})
export class PostPreviewComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  openPost() {
      this.router.navigate(['/blog/post', this.post.pid]);
  }

  @Input() post: Post;
  @Input() adminView: boolean;
  @Input() renderSeparator: boolean;
}
