/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, Subject } from 'rxjs';
import {
  GetLoans,
  MakeTransaction,
  Product,
  ProfileInfo,
  Stocks,
  Store,
  Transaction,
  UserProfile,
  Users,
  UsersStats,
  routes,
} from '../../core.index';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  allAppliedCandidates!: Array<object>;
  private triggerProfileSubject: Subject<void> = new Subject<void>();
  triggerProfile$: Observable<void> = this.triggerProfileSubject.asObservable();

  // Function to trigger sideMenu
  triggerEmpProfile(): void {
    this.triggerProfileSubject.next();
  }

  constructor(private http: HttpClient) { }

  public httpsOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    }),
  };

  public getProfile(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<any>(`${environment.apiUrl}/profile/`, {
      headers,
    });
  }
  public getUsers(roleId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<any>(`${environment.apiUrl}/users/?roleId=${roleId}`, {
      headers,
    });
  }
  public addUser(requestBody: Users): Observable<Users> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.post<Users>(
      `${environment.apiUrl}/users/`,
      requestBody,
      { headers }
    );
  }
  public editUser(id:number,requestBody: Users): Observable<Users> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.patch<Users>(
      `${environment.apiUrl}/users/${id}/`,
      requestBody,
      { headers }
    );
  }
  public deleteUser(id:number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.delete<any>(
      `${environment.apiUrl}/users/${id}/`,
      { headers }
    );
  }
  public getInventory(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<any>(`${environment.apiUrl}/stock/`, {
      headers,
    });
  }
  public getStore(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<any>(`${environment.apiUrl}/inventory/`, {
      headers,
    });
  }
  public addStore(requestBody: Store): Observable<Store> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.post<Store>(
      `${environment.apiUrl}/inventory/`,
      requestBody,
      { headers }
    );
  }
  public storeDetails(id:number): Observable<Stocks> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<Stocks>(
      `${environment.apiUrl}/inventoryDetails/?id=${id}`,
      { headers }
    );
  }
  public getStock(): Observable<Stocks> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<Stocks>(`${environment.apiUrl}/stock/`, {
      headers,
    });
  }
  public addStock(requestBody: Stocks): Observable<Stocks> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.post<Stocks>(
      `${environment.apiUrl}/stock/`,
      requestBody,
      { headers }
    );
  }
  public editStock(id:number,requestBody: Users): Observable<Users> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.patch<Users>(
      `${environment.apiUrl}/stock/${id}/`,
      requestBody,
      { headers }
    );
  }
  public deleteStock(id:number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.delete<any>(
      `${environment.apiUrl}/stock/${id}/`,
      { headers }
    );
  }
  public getProduct(): Observable<Stocks> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<Stocks>(`${environment.apiUrl}/products/`, {
      headers,
    });
  }
  public addProduct(requestBody: Stocks): Observable<Product> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.post<Product>(
      `${environment.apiUrl}/products/`,
      requestBody,
      { headers }
    );
  }
  public editProduct(id:number,requestBody: Users): Observable<Product> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.patch<Product>(
      `${environment.apiUrl}/products/${id}/`,
      requestBody,
      { headers }
    );
  }
  public deleteProduct(id:number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.delete<any>(
      `${environment.apiUrl}/products/${id}/`,
      { headers }
    );
  }
  public getTransaction(): Observable<Transaction> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<Transaction>(`${environment.apiUrl}/transactionHistory/`, {
      headers,
    });
  }
  public getTransactionById(id:number): Observable<Transaction> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<Transaction>(`${environment.apiUrl}/transactionHistory/?id=${id}`, {
      headers,
    });
  }
  public makeTransaction(requestBody: MakeTransaction): Observable<MakeTransaction> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.post<MakeTransaction>(
      `${environment.apiUrl}/stock/`,
      requestBody,
      { headers }
    );
  }
  public getLoans(): Observable<GetLoans> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<GetLoans>(`${environment.apiUrl}/loanRequest/`, {
      headers,
    });
  }
  public addLoan(requestBody: Stocks): Observable<Stocks> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.post<Stocks>(
      `${environment.apiUrl}/loanRequest/`,
      requestBody,
      { headers }
    )
  }
  public receivedLoan(id:number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.post<any>(
      `${environment.apiUrl}/loanApproved/${id}/`,
      { headers }
    );
  }
  public getDropDownUsers(roleId:number): Observable<Users> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<Users>(`${environment.apiUrl}/dropdownUsers/?roleId=${roleId}`, {
      headers,
    });
  }
  public getProductList(): Observable<Product> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<Product>(`${environment.apiUrl}/dropdownProducts/`, {
      headers,
    });
  }
 
  public getSalePurchase(): Observable<Product> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<Product>(`${environment.apiUrl}/salePurchase/`, {
      headers,
    });
  }
  public getUsersStats(): Observable<UsersStats> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<UsersStats>(`${environment.apiUrl}/userRoleCount/`, {
      headers,
    });
  }
 

  public getProfileData(): Observable<UserProfile> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    console.log(headers)
    return this.http.get<UserProfile>(
      `${environment.apiUrl}/userProfile/`,
      { headers }
    );
  }
  public updateProfileInfo(
    id: number,
    data: ProfileInfo
  ): Observable<ProfileInfo> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    console.log(id)
    return this.http.patch<ProfileInfo>(
      `${environment.apiUrl}/userProfile/${id}/`,
      data,
      { headers }
    );
  }

  // All Dropdown List Service
}
