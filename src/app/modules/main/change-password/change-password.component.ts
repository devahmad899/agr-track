import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Dictionary } from '@fullcalendar/core/internal';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService, DataService, Users } from 'src/app/core/core.index';
import { Product } from 'src/app/demo/api/product';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {

  products!: Product[];
  displayAddModal = false;
  displayEditModal = false;
  displayDeleteModal = false;
  form: FormGroup;
  stockList: Users[];
  selectedUserId: number;
  serialNumberArray: any[];
  public totalData = 0;
  noData: any
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  imageUrl: string | null | undefined;
  selectedFile: File | null = null;
  profilePictureBase64: string | null | ArrayBuffer = null;
  apiError: string;

  get f() {
    return this.form.controls;
  }
  constructor(private fb: FormBuilder, private data: DataService, private messageService: MessageService, private authService: AuthService, private route: ActivatedRoute,) {
    this.form = this.fb.group({
      email: [
        '',
        [
            Validators.required,
            Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'),
        ],
    ],
      current_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      confirm_password: ['', Validators.required],

    });
  }
  ngOnInit() {
    // this.fetchCusotomerData();
    this.form.patchValue({
      email: this.authService.email
    });
    this.items = [{ label: 'Change Password' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
  submit(): void {
    const formData = this.form.value;
    console.log('formData',formData)
    if (formData.current_password === formData.new_password) {
      this.messageService.add({ severity: 'warn', summary: 'Success', detail: 'Current password and new password cannot be the same.' });
      return;
    }
    if (formData.new_password === formData.confirm_password) {
      this.messageService.add({ severity: 'warn', summary: 'Success', detail: 'New password and Confirm password should be the same.' });
      return;
    }
    this.authService.changePassword(formData).subscribe((response:Dictionary)=>{
      if(response && response['status']===200){
        console.log('response',response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response['message'] });
        this.form.reset();
      }
      else {
        // Handle unexpected response format
        this.apiError =
          response['message'] || 'An error occurred during Password Update.';
          this.messageService.add({ severity: 'error', summary: 'Warning', detail: response['message'] });


      }
    },
    (error) => {
      console.log(error);
      this.apiError = 'An error occurred';
      this.messageService.add({ severity: 'success', summary: 'Success', detail: this.apiError });
    });
  }
}
