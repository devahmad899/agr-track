import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dictionary } from '@fullcalendar/core/internal';
import { MenuItem, MessageService } from 'primeng/api';
import { DataService, Users } from 'src/app/core/core.index';
import { Product } from 'src/app/demo/api/product';

@Component({
  selector: 'app-crops',
  templateUrl: './crops.component.html',
  styleUrl: './crops.component.scss'
})
export class CropsComponent {
  products!: Product[];
  displayAddModal = false;
  displayEditModal = false;
  displayDeleteModal = false;
  cropsForm: FormGroup;
  stockList: Users[];
  selectedUserId: number;
  serialNumberArray: any[];
  public totalData = 0;
  noData: any
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  get f() {
    return this.cropsForm.controls;
  }
  constructor(private fb: FormBuilder, private data: DataService, private messageService: MessageService) {
    this.cropsForm = this.fb.group({
      productName: ['', [Validators.required]],
      AvailaibleQuantity: ['', [Validators.required]],
      TotalQuantity: ['', [Validators.required]],
    });
  }
  private fetchCusotomerData(): void {
    this.stockList = [];
    this.serialNumberArray = [];
    let id = 2
    this.data.getUsers(id).subscribe(
      (res: Dictionary) => {
        console.log('API response:', res);
        if (res && res['status'] === 200) {
          this.stockList = res['data']
          this.stockList.forEach((user, index) => {
            user.srNo = index + 1;
          });
        }
      },
      (error) => {
        console.error('Error in API', error);
      });

  }
  ngOnInit() {
    this.fetchCusotomerData();
    this.items = [{ label: 'Crops' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  ShowModal(id: number) {
    if (id === 1) {
      this.displayAddModal = true;
    } else if (id === 2) {
      this.displayEditModal = true;
    } else {
      this.displayDeleteModal = true
    }
  }
  ConfirmDelete() {
    if (this.selectedUserId) {
      this.data.deleteUser(this.selectedUserId).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
            this.fetchCusotomerData()
            this.resetAll()

          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res['message'] });
            this.resetAll()
          }
        },
        (error) => {
          this.resetAll()
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
          console.error('Error in API', error);
        });
    }
  }
  onSelectUser(data: Users) {
    console.log(data, this.selectedUserId)
    this.selectedUserId = data.id
    console.log('selectedUser', this.selectedUserId)
    this.cropsForm.patchValue({
      name: data.fullname,
      AvailaibleQuantity: data.email,
      TotalQuantity: data.phoneNumber,
    });
  }
  resetAll() {
    this.displayAddModal = false
    this.displayEditModal = false
    this.displayDeleteModal = false
    this.cropsForm.reset()
    this.selectedUserId = null
  }
  EditUser() {
    if (this.cropsForm && this.cropsForm.valid) {
      let formData = this.cropsForm.value;
      console.log(formData)
      this.data.editUser(this.selectedUserId, formData).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
            this.fetchCusotomerData()
            this.resetAll()

          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res['message'] });
            this.resetAll()
          }
        },
        (error) => {
          this.resetAll()
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
          console.error('Error in API', error);
        });
    }
  }
  AddUser() {
    if (this.cropsForm && this.cropsForm.valid) {
      let formData = this.cropsForm.value;
      const roleId = 2
      formData = { ...this.cropsForm.value, roleId };
      console.log(formData)
      this.data.addUser(formData).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.fetchCusotomerData()
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
            this.displayAddModal = false
            this.cropsForm.reset()

          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res['message'] });
            this.displayAddModal = false
            this.cropsForm.reset()
          }
        },
        (error) => {
          this.displayAddModal = false
          this.cropsForm.reset()
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

          console.error('Error in API', error);
        });
    }
  }
}
