import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService, routes } from '../../core.index';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {
  getList: any;
  constructor(private apiService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
    this.getList = this.apiService.decodeToken();
    // console.log('i am interceptor', this.getList)
    if (this.getList && this.getList.exp) {
      var theDate = new Date(this.getList.exp * 1000);
      var dateString = theDate.getTime();
      var currentDate = new Date().getTime();
      if (currentDate > dateString) {
        this.router.navigate([routes.login]);
        localStorage.clear();

      }
    }
    else{
      console.log('Token doesnt exist')
      this.router.navigate(['/']);
    }

    return next.handle(request);


  }
}
