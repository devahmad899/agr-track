import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { DataService, Users } from 'src/app/core/core.index';
import { Product } from 'src/app/demo/api/product';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  products!: Product[];
  displayAddModal = false;
  displayEditModal = false;
  displayDeleteModal = false;
  userForm: FormGroup;
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

  get f() {
    return this.userForm.controls;
  }
  constructor(private fb: FormBuilder, private data: DataService, private messageService: MessageService) {
    this.userForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'),
        ],
      ],
      fullname: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]], // 10 digit number
      cnic: ['', [Validators.required, Validators.pattern(/\d{5}\d{7}\d/)]], // CNIC pattern
      address: [''],
    });
  }
  ngOnInit() {
    // this.fetchCusotomerData();
    this.items = [{ label: 'User Profile' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
  UpdateUser(){

  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      if (!this.validateFile(file)) {
        return;
      }
      this.convertToBase64(file);
    }
  }

  private validateFile(file: File): boolean {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.type)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid file type. Please upload an image.' });
      return false;
    }

    if (file.size > 1048576) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Image size cannot exceed 1 MB.' });
      return false;
    }

    return true;
  }
  
  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      // Sanitize base64 string (if necessary)
      this.profilePictureBase64 = reader.result as string
    };
    reader.readAsDataURL(file);
  }
}
