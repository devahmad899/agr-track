import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Dictionary } from '@fullcalendar/core/internal';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthService, routes } from 'src/app/core/core.index';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
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
export class LoginComponent {

    valCheck: string[] = ['remember'];

    password!: string;
    form!: FormGroup;
    public routes = routes;

    public Toggledata = true;
    apiError: string | null = null;

    get f() {
        return this.form.controls;
    }
    constructor(public layoutService: LayoutService, private authService: AuthService, private fb: FormBuilder, private router: Router, private messageService: MessageService,
        private primengConfig: PrimeNGConfig) {
        this.form = this.fb.group({
            username: [
                '',
                [
                    Validators.required,
                    Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'),
                ],
            ],
            password: ['', [Validators.required, Validators.maxLength(8)]],
        });
    }

    ngOnInit() {
        this.primengConfig.ripple = true;

    }
    getCall() {
        console.log('i am in get call')
        this.authService.demo().subscribe((response : any) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response['message'] });
            console.log(response)
        })
    }
    submit(): void {
        if (this.form && this.form.valid) {
            const formData = this.form.value;
            // console.log(formData)
            this.authService.loginUser(formData).subscribe(
                (response: Dictionary) => {
                    if (response && response['status'] === 200) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: response['message'] });
                        const access_token = response['data'].access_token;
                        localStorage.setItem('access_token', access_token);
                        this.authService.decodeToken();
                        this.authService.login();
                        this.router.navigate([routes.dashboard]);
                    } else {
                        // Handle unexpected response format
                        console.error('Unexpected response format:', response);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: response['message'] });
                        this.apiError =
                            response['message'] || 'An error occurred during login.';
                        //   this.toaster.typeError(response['message'], 'Failure');
                    }
                },
                (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred during login.' });
                    console.log(error);
                    this.apiError = 'An error occurred during login.';
                    //   this.toaster.typeError(this.apiError, 'Failed');
                }
            );
        }
    }
}

