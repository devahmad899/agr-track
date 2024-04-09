import { BehaviorSubject } from 'rxjs';

export class routes {
  public static layoutDirection: BehaviorSubject<string> =
    new BehaviorSubject<string>(localStorage.getItem('rtl') || '');
  private static Url = '';
  
  static rtl = this.layoutDirection.subscribe((res: string) => {
    this.Url = res;
    console.log(this.Url)
  });

  public static get baseUrl(): string {
    return this.Url;
  }
  public static get dashboard(): string {
    return this.baseUrl + '/';
  }
  public static get login(): string {
    return this.baseUrl + '/auth/login';
  }
  public static get forgot_password(): string {
    return this.baseUrl + '/auth/forgot-password';
  }
  public static get reset_password(): string {
    return this.baseUrl + '/reset-password';
  }
  public static get customer(): string {
    return this.baseUrl + '/customer';
  }
  public static get farmers(): string {
    return this.baseUrl + '/farmers';
  }
  public static get employees(): string {
    return this.baseUrl + '/employees';
  }
  public static get crops(): string {
    return this.baseUrl + '/crops';
  }
  public static get inventory(): string {
    return this.baseUrl + '/stock';
  }
  public static get sale(): string {
    return this.baseUrl + 'crops/sale';
  }
  public static get purchase(): string {
    return this.baseUrl + 'crops/purchase';
  }
  public static get accountability(): string {
    return this.baseUrl + '/accountability';
  }
  public static get transactions(): string {
    return this.baseUrl + '/transactions';
  }
  public static get configuration(): string {
    return this.baseUrl + '/configuration';
  }
  public static get system_settings(): string {
    return this.baseUrl + '/system-settings';
  }
  public static get userProfile(): string {
    return this.baseUrl + '/user-profile';
  }
  public static get changePassword(): string {
    return this.baseUrl + '/change-password';
  }
}
