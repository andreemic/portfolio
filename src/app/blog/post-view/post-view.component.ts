import { Component, OnInit } from '@angular/core';
import { Post } from '../blog-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogApiService } from '../blog-api.service';
@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss'],
})
export class PostViewComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: BlogApiService
  ) {}

  ngOnInit(): void {
    this.getPost();
  }

  post: Post;
  getPost(): void {
    var idStr = this.route.snapshot.paramMap.get('pid');
    if (idStr) {
      const id = +idStr;
      this.api.getPost(id).subscribe(
        (post: Post) => {
          this.post = post;
        },
        (err: any) => {
          this.router.navigateByUrl('/blog');
        }
      );
    }
  }
}
