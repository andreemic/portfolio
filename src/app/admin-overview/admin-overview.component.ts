import { Component, OnInit } from '@angular/core';
import { BlogApiService, Post } from '../blog/blog-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.scss'],
})
export class AdminOverviewComponent implements OnInit {
  constructor(public api: BlogApiService, private router: Router) {}

  posts: Post[];
  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.api.getAllPosts$().subscribe((posts: Post[]) => (this.posts = posts));
  }
  redirectToNew() {
    this.router.navigateByUrl('admin/blog/post/new');
  }
}
