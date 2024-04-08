import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dictionary } from '@fullcalendar/core/internal';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthService, routes } from 'src/app/core/core.index';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
  providers: [MessageService]

})
export class ResetPasswordComponent {

  valCheck: string[] = ['remember'];

  password!: string;
  form!: FormGroup;
  public routes = routes;

  public Toggledata = true;
  apiError: string | null = null;

  get f() {
    return this.form.controls;
  }
  constructor(public layoutService: LayoutService, private authService: AuthService, private fb: FormBuilder, private route: ActivatedRoute, private messageService: MessageService,
    private primengConfig: PrimeNGConfig) {
    this.form = this.fb.group({
      password: ['', [Validators.required]],
      confirm_password: ['', Validators.required],

    });
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
  submit() {
    if (this.form && this.form.valid) {
      const formData = this.form.value;
      console.log('hello')

      this.route.queryParams.subscribe(params => {
        const key = params['key'];
        if (key) {
          console.log('hello')
          this.authService.resetPassword(key, formData).subscribe((response: Dictionary) => {
            console.log('Password Change Successfully', response)
            if (response && response['status'] === 200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response['message'] });
              this.form.reset();
            } else if (response && response['status'] === 400) {
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: response['message'] });
            } else {
              console.error('Unexpected response format:', response);
              this.apiError = response['message'] || 'An error occurred during reset password.';
              this.messageService.add({ severity: 'warning', summary: 'Success', detail: 'Message Content' });
            }
          },
            (error) => {
              console.log(error);
              this.apiError = 'An error occurred';
            this.messageService.add({ severity: 'success', summary: 'Success', detail: this.apiError });
            });
        } else {
          console.log("Key Not Found!");
        }
      });
    }
  }
}

