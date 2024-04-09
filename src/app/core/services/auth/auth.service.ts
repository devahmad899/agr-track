import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login, MenuItem, forgetPassword, resetPassword, Permissions } from '../interface/models';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
  }

  private isAuthenticated = false;
  private token: string = localStorage.getItem('access_token') || '';
  public user_name = "";
  public roleName = "";
  public email = "";
  public superUserId!: number
  public user_id!: number;
  public role_id!: number;

  decodeToken():any  {
    this.token = localStorage.getItem('access_token') || '';
    // Check if the token is present
    if (!this.token) {
      console.error('Access token not found in local storage.');
      return null; // or handle the absence of the token according to your requirements
    }
    let decodedPayload: any = jwtDecode(this.token)
    // console.log('decodedToken', decodedPayload)
    // Access the decoded payload properties
     
      // this.isSuperUser = decodedPayload.superuser;
      // this.user_name = decodedPayload.firstname;
      this.user_id = decodedPayload.user_id;
      this.email = decodedPayload.email;
      this.roleName = decodedPayload.roleName;
      this.role_id = decodedPayload.roleId;
      this.superUserId = decodedPayload.superUserId;
      // this.role_id = decodedPayload.roleID
    return decodedPayload
  }


  // decodeToken(): any {
  //   // Retrieve the token from local storage
  //   this.token = localStorage.getItem('access_token') || '';

  //   // Check if the token is present
  //   if (!this.token) {
  //     console.error('Access token not found in local storage.');
  //     return null; // or handle the absence of the token according to your requirements
  //   }

  //   try {
  //     // Decode the token
  //     const base64Url = this.token.split('.')[1];
  //     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //     const decodedPayload = JSON.parse(atob(base64));

  //     // Access the decoded payload properties
  //     this.companiesList = decodedPayload.companies;
  //     this.currentCompany = decodedPayload.currentCompany.name;
  //     this.isSuperUser = decodedPayload.superuser;
  //     this.isHr = decodedPayload.isHR;
  //     this.user_name = decodedPayload.firstname;
  //     this.user_id = decodedPayload.user_id;
  //     this.role_id = decodedPayload.roleID

  //     // Log the decoded payload
  //     console.log('Token decoded:', decodedPayload);

  //     // Return the decoded payload
  //     return decodedPayload;
  //   } catch (error) {
  //     // console.error('Error decoding token:', error);
  //     return null; // or handle the decoding error according to your requirements
  //   }
  // }
  isAdmin(): boolean {
    if (this.role_id && this.role_id == 1) {
      console.log(true)
      return true
    } else {
      return false
    }
  }

  canActivate(): boolean {
    if (this.isAuthenticated || this.checkLocalStorageToken()) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }

  login() {
    this.isAuthenticated = true;
  }

  logout() {
    this.isAuthenticated = false;
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  private checkLocalStorageToken(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  // New method to check if the user is already logged in
  isUserAlreadyLoggedIn(): boolean {
    return this.isAuthenticated || this.checkLocalStorageToken();
  }

  Header = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };

  loginUser(requestBody: Login): Observable<Login> {
    return this.http.post<Login>(
      `${environment.apiUrl}/login/`,
      requestBody,
      this.Header
    );
  }
  demo(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<any>(`${environment.apiUrl}/users/`, { headers });
  }
  // change password

  changePassword(requestBody: Login): Observable<Login> {
    return this.http.post<Login>(
      `${environment.apiUrl}/changePassword/`,
      requestBody,
      this.Header
    );
  }
  forgetPassword(requestBody: forgetPassword): Observable<forgetPassword> {
    return this.http.post<forgetPassword>(
      `${environment.apiUrl}/forgotpassword/`,
      requestBody,
      this.Header
    );
  }
  resetPassword(
    key: any,
    requestBody: resetPassword
  ): Observable<resetPassword> {
    return this.http.post<resetPassword>(
      `${environment.apiUrl}/resetPassword/?key=${key}`,
      requestBody,
      this.Header
    );
  }
  findPermissionsByUrl(menuItems: MenuItem[], targetUrl: string): Permissions[] | null {
    for (const menuItem of menuItems) {
      if (menuItem.url === targetUrl) {
        return menuItem.permissions;
      }

      // If the menu item has submenus, recursively search in them
      if (menuItem.submenus && Array.isArray(menuItem.submenus)) {
        const subMenuPermissions = this.findPermissionsByUrl(menuItem.submenus, targetUrl);
        if (subMenuPermissions !== null) {
          return subMenuPermissions;
        }
      }
    }

    return null; // URL not found in any menu item
  }

}
