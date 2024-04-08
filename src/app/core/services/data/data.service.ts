/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, Subject } from 'rxjs';
import {
  AttendanceApprovalRequest,
  AttendanceReport,
  AttendanceRequest,
  Buildings,
  CompanyInfo,
  Department,
  EmployeeIds,
  Grade,
  Holiday,
  HolidayEdit,
  Leaves,
  MyTreeNode,
  Organization,
  OrganizationLink,
  ProfileInfo,
  Shifts,
  SideBar,
  SideBarMenu,
  TokenCompaniesList,
  TreeNode,
  UserProfile,
  Users,
  allroles,
  apiResultFormat,
  genEmpCode,
  getEmployees,
  globalSetup,
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

  // fetch Roles
  public getRoles(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<any>(`${environment.apiUrl}/roleDetails/`, {
      headers,
    });
  }
  // update Roles
  public updateRoles(
    role_id: number,
    updatedRoleData: allroles
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.patch<any>(
      `${environment.apiUrl}/roleDetails/${role_id}/`,
      updatedRoleData,
      { headers }
    );
  }
  // delete Roles
  public deleteRoles(role_id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.delete<any>(
      `${environment.apiUrl}/roleDetails/${role_id}/`,
      { headers }
    );
  }
  // Create Role
  public createRole(roleName: allroles): Observable<allroles> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.post<allroles>(
      `${environment.apiUrl}/roleDetails/`,
      roleName,
      { headers }
    );
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
  public getStock(roleId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<any>(`${environment.apiUrl}/stock/`, {
      headers,
    });
  }
  public addStock(requestBody: Users): Observable<Users> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.post<Users>(
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
 
  // Employee Management
  public getEmployee(
    name: string,
    page: number,
    size: number,
    department_id: number | null,
    designation_id: number | null
  ): Observable<getEmployees[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });

    const queryParams: any = {};

    // Set name if provided
    if (name && name.trim() !== '') {
      queryParams['name'] = name;
      if (name !== '') {
        delete queryParams['page'];
        delete queryParams['size'];
        delete queryParams['department_id'];
        delete queryParams['designation_id'];
      }
    } else {
      // Set page if greater than 1 or if size is provided
      if (page > 1) {
        queryParams['page'] = page;
      }

      // Set size if greater than 10
      if (size && size > 10) {
        queryParams['size'] = size;
      }

      // Set department_id if provided
      if (department_id !== null) {
        queryParams['department_id'] = department_id;
      }

      // Set designation_id if provided
      if (designation_id !== null) {
        queryParams['designation_id'] = designation_id;
      }
    }

    return this.http.get<getEmployees[]>(
      `${environment.apiUrl}/employeeDetails/`,
      {
        headers,
        params: queryParams,
      }
    );
  }

  public addEmployee(requestBody: getEmployees): Observable<getEmployees> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.post<getEmployees>(
      `${environment.apiUrl}/employeeDetails/`,
      requestBody,
      { headers }
    );
  }
  public updateEmployee(
    id: number,
    data: getEmployees
  ): Observable<getEmployees> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.patch<getEmployees>(
      `${environment.apiUrl}/employeeDetails/${id}/`,
      data,
      { headers }
    );
  }
  public deleteEmployee(id: number): Observable<getEmployees> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.delete<getEmployees>(
      `${environment.apiUrl}/employeeDetails/${id}/`,
      { headers }
    );
  }
  // Assign Company
  public assignCompany(id: number): Observable<TokenCompaniesList[]> {
    console.log('id', id);
    return this.http.get<TokenCompaniesList[]>(
      `${environment.apiUrl}/assignCompany/?id=${id}`,
      this.httpsOptions
    );
  }
  public updateAssignCompany(
    id: number,
    requestBody: TokenCompaniesList
  ): Observable<TokenCompaniesList[]> {
    console.log('id', id);
    return this.http.patch<TokenCompaniesList[]>(
      `${environment.apiUrl}/assignCompany/${id}/`,
      requestBody,
      this.httpsOptions
    );
  }
  // Change Company
  public changeCompany(
    id: number,
    requestBody: TokenCompaniesList
  ): Observable<TokenCompaniesList> {
    return this.http.patch<TokenCompaniesList>(
      `${environment.apiUrl}/changeCompany/${id}/`,
      requestBody,
      this.httpsOptions
    );
  }
  // Bulk Upload
  bulkUpload(file: File, roleId: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('roleId', roleId);

    return this.http.post<any>(
      `${environment.apiUrl}/employeeBulkupload/`,
      formData,
      {
        headers: headers,
        reportProgress: true,
        observe: "events"
      });
  }
  // generate Employee Code
  public generateEmployeeCode(requestBody: genEmpCode): Observable<genEmpCode> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.post<genEmpCode>(
      `${environment.apiUrl}/empid/`,
      requestBody,
      { headers }
    );
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
  public updateCompanyInfo(
    id: number,
    data: CompanyInfo
  ): Observable<CompanyInfo> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    console.log(id)
    return this.http.patch<CompanyInfo>(
      `${environment.apiUrl}/userProfile/${id}/`,
      data,
      { headers }
    );
  }
  // All Dropdown List Services

  public getDepartmentsList(): Observable<Department[]> {
    return this.http.get<Department[]>(
      `${environment.apiUrl}/getDepartments/`,
      this.httpsOptions
    );
  }
  public getDesignationList(): Observable<Department[]> {
    return this.http.get<Department[]>(
      `${environment.apiUrl}/getDesignation/`,
      this.httpsOptions
    );
  }
  public getSalutationList(): Observable<globalSetup[]> {
    return this.http.get<globalSetup[]>(
      `${environment.apiUrl}/getSalutations/`,
      this.httpsOptions
    );
  }
  public getMaritalStatusList(): Observable<globalSetup[]> {
    return this.http.get<globalSetup[]>(
      `${environment.apiUrl}/getMaritalStatus/`,
      this.httpsOptions
    );
  }

  public getReligionList(): Observable<globalSetup[]> {
    return this.http.get<globalSetup[]>(
      `${environment.apiUrl}/getReligions/`,
      this.httpsOptions
    );
  }
  public getNationalityList(): Observable<globalSetup[]> {
    return this.http.get<globalSetup[]>(
      `${environment.apiUrl}/getNationality/`,
      this.httpsOptions
    );
  }
  public getBuildingsList(): Observable<Buildings[]> {
    return this.http.get<Buildings[]>(
      `${environment.apiUrl}/getBuildings/`,
      this.httpsOptions
    );
  }
  public getGradeList(): Observable<Grade[]> {
    return this.http.get<Grade[]>(
      `${environment.apiUrl}/getGrades/`,
      this.httpsOptions
    );
  }
  public getShiftsList(): Observable<Shifts[]> {
    return this.http.get<Shifts[]>(
      `${environment.apiUrl}/getShifts/`,
      this.httpsOptions
    );
  }
  public getReportingList(): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/ReportingToDetails/`,
      this.httpsOptions
    );
  }
  public getReportingProfileList(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });
    return this.http.get<any[]>(
      `${environment.apiUrl}/ReportingToProfileDetails/`,
      { headers }
    );
  }
}