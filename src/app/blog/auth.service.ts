import { Injectable } from '@angular/core';
import { Observable, throwError as ObservableThrowError } from 'rxjs';
import { map, tap, shareReplay, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';
import decode from 'jwt-decode';

export interface User {
  uid: number;
  username: string;
  token: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface ServerUserResp {
  user?: User;

  emailMessage?: string;
  pwMessage?: string;
  error?: {
    message: string;
  };
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(user: Credentials): Observable<ServerUserResp> {
    return this.http
      .post<ServerUserResp>('/admin/api/login', { user })
      .pipe(
        tap((res) => this.setSession(res)),
        catchError(this._handleError),
        shareReplay()
      );
  }

  getUser(): Observable<User> {
    return this.http.get<ServerUserResp>('/admin/api/get/current_user').pipe(
      tap((res) => this.setSession(res)),
      map((res: ServerUserResp) => res.user),
      shareReplay()
    );
  }

  private setSession(authResult: ServerUserResp) {
    if (authResult.user.token) {
      let payload: any = decode(authResult.user.token);
      const expiresAt = moment(payload.exp);

      localStorage.setItem('id_token', authResult.user.token);
      localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  getExpiration() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));

    return moment(expiresAt * 1000);
  }
  private _handleError(res: HttpErrorResponse | any) {
    return ObservableThrowError(res.error);
  }
}
