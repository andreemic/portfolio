import { Component, OnInit } from '@angular/core';
import { BlogApiService, Post } from '../blog-api.service';

@Component({
  selector: 'app-blog-overview',
  templateUrl: './blog-overview.component.html',
  styleUrls: ['./blog-overview.component.scss'],
})
export class BlogOverviewComponent implements OnInit {
  constructor(public api: BlogApiService) {}

  posts: Post[];
  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.api.getPosts$().subscribe((posts: Post[]) => (this.posts = posts));
  }
}
