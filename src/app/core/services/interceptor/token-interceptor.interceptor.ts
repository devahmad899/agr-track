import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpInterceptorFn
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
,
import { Observable } from 'rxjs';
@Injectable()
export const tokenInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  
  return next(req);
};
