import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthService, routes } from 'src/app/core/core.index';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
        .overlay-loader::after {
          content: "";
          position: absolute;
          background: rgb(0,0,0,0.3);
          inset: 0;
          z-index: 5;
        }
        .prograsee-spinner{
          z-index: 6;
        }
    `],
  providers: [MessageService]

})
export class ForgetPasswordComponent {

  valCheck: string[] = ['remember'];

  password!: string;
  form!: FormGroup;
  public routes = routes;
  public showLoader = false;

  public Toggledata = true;
  apiError: string | null = null;

  get f() {
    return this.form.controls;
  }
  constructor(public layoutService: LayoutService, private authService: AuthService, private fb: FormBuilder, private router: Router, private messageService: MessageService,
    private primengConfig: PrimeNGConfig) {
    this.form = this.fb.group({
      email: ['', [Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
    });
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
  submit() {
    if (this.form.valid) {
      const formData = this.form.value;
      this.showLoader = true
      this.authService.forgetPassword(formData).subscribe(
        (response: any) => {
          console.log('Email sent', response);
          if (response && response['status'] === 200) {
            this.showLoader= false;
            this.form.reset()
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response['message'] });
          } else {
            this.showLoader = false

            // Handle unexpected response format
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response['message'] });
          }
        },
        (error) => {
          this.showLoader = false
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred during password reset' });
          this.apiError = 'An error occurred during login.';
          //   this.toaster.typeError(this.apiError, 'Failed');
        }
      )
    }

  }
}

