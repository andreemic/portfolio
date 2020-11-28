import { Injectable } from '@angular/core';

import { Observable, throwError as ObservableThrowError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import moment from 'moment';
export interface Post {
  pid?: number;
  title: string;
  body: string;
  dateCreated: moment.Moment;

  date_created: string;
  thumbnail_path_big?: string;
  thumbnail_path_small?: string;

  description: string;
  hidden: boolean;
  thumbnailPath?: {
    small?: string;
    big?: string;
  };
}
interface PostSendObj extends Post {
  thumbnail: string; // base64 encoded image
}
@Injectable({
  providedIn: 'root',
})
export class BlogApiService {
  constructor(private http: HttpClient) {}
  getPosts$(): Observable<Post[]> {
    return this.http.get<Post[]>('api/get/posts').pipe(
      map((posts: Post[]) => posts.map(this.formatPost)),
      catchError((err) => this._handleError(err))
    );
  }
  getAllPosts$(): Observable<Post[]> {
    return this.http.get<Post[]>('admin/api/get/allposts').pipe(
      map((posts: Post[]) => posts.map(this.formatPost)),
      catchError((err) => this._handleError(err))
    );
  }

  private formatPost(post: Post): Post {
    return {
      ...post,
      dateCreated: moment(post.date_created),
      thumbnailPath: {
        small: post.thumbnail_path_small,
        big: post.thumbnail_path_big,
      },
    };
  }

  getPost(id: number) {
    return this.http.get<Post>(`api/get/post?pid=${id}`).pipe(
      map(this.formatPost),
      catchError((err) => this._handleError(err))
    );
  }

  getPostAdmin(id: number) {
    return this.http.get<Post>(`admin/api/get/post?pid=${id}`).pipe(
      map(this.formatPost),
      catchError((err) => this._handleError(err))
    );
  }

  addPost(post: Post, thumbnail?: string) {
    const data: PostSendObj | any = { ...post };
    // This prevents from sending the path to a saved Image instead
    // of new uploaded base64. It is terrible.
    if (thumbnail && thumbnail.indexOf(';base64') != -1) {
      data.thumbnail = thumbnail;
    }
    return this.http
      .post(`admin/api/post/addpost`, data)
      .pipe(catchError((err) => this._handleError(err)));
  }

  updatePost(post: Post, thumbnail?: string) {
    const data: PostSendObj | any = { ...post };
    if (thumbnail && thumbnail.indexOf(';base64') !== -1) {
      data.thumbnail = thumbnail;
    }
    return this.http
      .put(`admin/api/put/post`, data)
      .pipe(catchError((err) => this._handleError(err)));
  }

  deletePost(pid: number) {
    return this.http
      .delete(`admin/api/delete/post?pid=${pid}`)
      .pipe(catchError((err) => this._handleError(err)));
  }
  getPostId(post: Post) {
    return post.pid;
  }

  private _handleError(err: HttpErrorResponse | any): Observable<any> {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (
      err.message &&
      err.message.indexOf('No authorization token was found') > -1
    ) {
      console.error('No Auth Token');
    }
    return ObservableThrowError(errorMsg);
  }
}
