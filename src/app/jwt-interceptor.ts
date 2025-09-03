import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from sessionStorage (or wherever you store it)
    const token = sessionStorage.getItem('token');

    if (token) {
      // Clone the request and add the Authorization header with the Bearer token
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      // Pass the cloned request instead of the original request to the next handler
      return next.handle(cloned);
    }

    // If no token, just forward the original request
    return next.handle(req);
  }
}
