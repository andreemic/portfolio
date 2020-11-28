import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const idToken = localStorage.getItem('id_token');

    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Token ' + idToken),
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
