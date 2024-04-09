import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dictionary } from '@fullcalendar/core/internal';
import { MenuItem, MessageService } from 'primeng/api';
import { DataService, Profile, Users } from 'src/app/core/core.index';
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
  userData: Profile;
  profilePic: string;
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
      profilePicture: [''],
    });
  }
  ngOnInit() {
    // this.fetchCusotomerData();
    this.items = [{ label: 'User Profile' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.getProfileData()

  }
  getProfileData() {
    this.data.getProfile().subscribe(
      (res: Dictionary) => {
        console.log('API response:', res);
        if (res && res['status'] === 200) {
          this.userData = res['data']
          this.patchvalues(this.userData)
          this.selectedUserId = this.userData[0].id
          console.log('user data', this.selectedUserId)
          this.profilePictureBase64 = this.userData[0].profilePicture
          const profilePictureBase64 = this.userData[0].profilePicture
          const imageBlob = this.base64ToArrayBuffer(profilePictureBase64);
          this.imageUrl = URL.createObjectURL(imageBlob);
          this.profilePic = this.userData[0].profilePicture
        }
      },
      (error) => {
        console.error('Error in API', error);
      });
  }
  patchvalues(data: Profile) {
    console.log('data', data)
    const currentUserdata = data['0']
    this.userForm.patchValue({
      fullname: currentUserdata.fullname,
      email: currentUserdata.email,
      phoneNumber: currentUserdata.phoneNumber,
      cnic: currentUserdata.cnic,
      address: currentUserdata.address,
      landinfo: currentUserdata.landInfo,
    });
  }
  updateUser() {
    if (this.userForm && this.userForm.valid) {
      let formData = this.userForm.value;
      if (this.profilePictureBase64 !== this.userData['0'].profilePicture) {
        formData.profilePicture = this.profilePictureBase64;
      } else {
        delete this.userForm.value.profilePicture;
      }
      console.log(formData)
      this.data.editUser(this.selectedUserId, formData).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
            this.getProfileData()

          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res['message'] });
          }
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
          console.error('Error in API', error);
        });
    }
  }
  base64ToArrayBuffer(base64: string) {
    // Split base64 string to extract content type and data
    const contentType = base64.split(';')[0].split(':')[1];
    const binaryString = atob(base64.split(',')[1]);
    // Create ArrayBuffer and Uint8Array
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    // Fill ArrayBuffer with byte values
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    // Create Blob with extracted content type
    return new Blob([arrayBuffer], { type: contentType });
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
