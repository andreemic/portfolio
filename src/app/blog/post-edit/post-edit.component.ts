import {
  Component,
  OnInit,
  Inject,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Post } from '../blog-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogApiService } from '../blog-api.service';

import {
  MatSnackBar,
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

/**
 * @title Snack-bar with a custom component
 */
@Component({
  selector: 'snack-bar-custom-component',
  templateUrl: './post-edit-snackbar.component.html',
})
export class SnackBarCustomComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss'],
})
export class PostEditComponent implements OnInit {
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }
  quillModules = {
    syntax: true,
  };

  constructor(
    private router: Router,
    private api: BlogApiService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}
  snackBarRef: MatSnackBarRef<SnackBarCustomComponent>;
  openSnackBar(html: string) {
    this.snackBarRef = this._snackBar.openFromComponent(
      SnackBarCustomComponent,
      {
        duration: 5000,
        data: {
          html,
        },
      }
    );
  }

  post: Post = {
    title: '',
    body: '',
    dateCreated: null,
    date_created: '',
    description: '',
    hidden: true,
  };
  postPristine: boolean; // Whether post is as stored in database
  thumbnailPath: string;
  thumbnailUrl: string;
  isNewPost: boolean = true;
  ngOnInit(): void {
    this.getPost();
  }

  getPost(): void {
    var idStr = this.route.snapshot.paramMap.get('pid');
    if (idStr) {
      const id = +idStr;
      this.api.getPostAdmin(id).subscribe(
        (post: Post) => {
          this.post = post;
          this.isNewPost = false;
          this.thumbnailUrl = post.thumbnailPath.small;
        },
        (err: any) => {
          this.router.navigateByUrl('/admin/post/new');
        }
      );
    } else {
      this.isNewPost = true;
    }
  }

  savePost(): void {
    let obs = this.isNewPost
      ? this.api.addPost(this.post, this.thumbnailUrl)
      : this.api.updatePost(this.post, this.thumbnailUrl);
    obs.subscribe((res) => {
      if (
        res.pid !== undefined &&
        (!this.post.pid || this.post.pid == res.pid)
      ) {
        this.openSnackBar(
          `Post <a href="/blog/post/${res.pid}"">#${res.pid}</a> is ${
            this.post.hidden ? 'hidden' : 'live'
          }.`
        );

        if (this.isNewPost) {
          this.isNewPost = false;
          this.post.pid = res.pid;
        }
      } else {
        this.openSnackBar(
          `Trouble uploading post. See console for server resp.`
        );
        console.log('Server Response:', res);
      }
    });
  }

  deletePost() {
    this.api.deletePost(this.post.pid).subscribe((res) => {
      if (res.pid !== undefined) {
        this.openSnackBar(`Post #${res.pid} is gone forever.`);
        this.router.navigateByUrl('/admin');
      } else {
        this.openSnackBar(
          `Trouble deleting post. See console for server resp.`
        );
        console.log('Server Response:', res);
      }
    });
  }

  // Big Image: 1280px / 720px
  // Small Image: 640px / 360px
  onImageChanged(event) {
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    this.thumbnailPath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event: ProgressEvent<FileReader>) => {
      this.thumbnailUrl = reader.result as string;
    };
  }
}
