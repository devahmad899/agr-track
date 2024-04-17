import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dictionary } from '@fullcalendar/core/internal';
import { MenuItem, MessageService } from 'primeng/api';
import { Column, DataService, ExportColumn, Transaction, Users } from 'src/app/core/core.index';
import { Product } from 'src/app/demo/api/product';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {
  products!: Product[];
  displayAddModal = false;
  displayEditModal = false;
  displayDeleteModal = false;
  displayHistoryModal = false;
  userForm: FormGroup;
  userList: Users[];
  selectedUserId: number;
  serialNumberArray: any[];
  public totalData = 0;
  noData: any
  items: MenuItem[] | undefined;
  showLoader = false
  home: MenuItem | undefined;
  transactionlist: Transaction[];
  historyLoader = false
  cols: Column[]
  exportColumns!: ExportColumn[];

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
  private fetchCusotomerData(): void {
    this.userList = [];
    this.serialNumberArray = [];
    let id = 3
    this.showLoader = true
    this.data.getUsers(id).subscribe(
      (res: Dictionary) => {
        console.log('API response:', res);
        if (res && res['status'] === 200) {
          this.userList = res['data']
          this.userList.forEach((user, index) => {
            user.srNo = index + 1;
          });
          this.showLoader = false
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res['message'] });
          this.showLoader = false
        }
      },
      (error) => {
        this.showLoader = false
        console.error('Error in API', error);
      });

  }
  ngOnInit() {
    this.cols = [
      { field: 'srNo.', header: 'Sr No.', customExportHeader: 'Sr No.' },
      { field: 'cropsName', header: 'Crops Name' },
      { field: 'saller', header: 'Saller' },
      { field: 'purchaser', header: 'Purchaser' },
      { field: 'date', header: 'Date' },
      { field: 'saleRate', header: 'Sale Rate' },
      { field: 'purchaseRate', header: 'Purchase Rate' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'bill', header: 'Bill' },
    ];
    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    this.fetchCusotomerData();
    this.items = [{ label: 'Customers' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  ShowModal(id: number) {
    if (id === 1) {
      this.displayAddModal = true;
    } else if (id === 2) {
      this.displayEditModal = true;
    } else if (id === 4) {
      this.displayHistoryModal = true;
    }
    else {
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
    this.userForm.patchValue({
      fullname: data.fullname,
      email: data.email,
      phoneNumber: data.phoneNumber,
      cnic: data.cnic,
      address: data.address,
      landinfo: data.landInfo,
    });
  }
  onSelectID(id: number) {
    this.selectedUserId = id;
    this.fetchTransactionHistory()
  }
  fetchTransactionHistory(): void {
    this.transactionlist = [];
    this.serialNumberArray = [];
    this.historyLoader = true
    this.data.getTransactionById(this.selectedUserId).subscribe(
      (res: Dictionary) => {
        console.log('API response:', res);
        this.historyLoader = false
        if (res && res['status'] === 200) {
          this.transactionlist = res['data']
          this.transactionlist.forEach((user, index) => {
            user.srNo = index + 1;
          });
        }
      },
      (error) => {
        this.historyLoader = false
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        console.error('Error in API', error);
      });

  }
  resetAll() {
    this.displayAddModal = false
    this.displayEditModal = false
    this.displayDeleteModal = false
    this.userForm.reset()
    this.selectedUserId = null
  }
  EditUser() {
    if (this.userForm && this.userForm.valid) {
      let formData = this.userForm.value;
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
    if (this.userForm && this.userForm.valid) {
      let formData = this.userForm.value;
      const roleId = 3
      formData = { ...this.userForm.value, roleId };
      console.log(formData)
      this.data.addUser(formData).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.fetchCusotomerData()
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
            this.displayAddModal = false
            this.userForm.reset()

          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res['message'] });
            this.displayAddModal = false
            this.userForm.reset()
          }
        },
        (error) => {
          this.displayAddModal = false
          this.userForm.reset()
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

          console.error('Error in API', error);
        });
    }
  }
}
