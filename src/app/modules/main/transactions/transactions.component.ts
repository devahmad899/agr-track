import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dictionary } from '@fullcalendar/core/internal';
import { MenuItem, MessageService } from 'primeng/api';
import { DataService, Transaction, Users } from 'src/app/core/core.index';
import { Product } from 'src/app/demo/api/product';

@Component({
  selector: 'app-transections',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent {
  products!: Product[];
  displayAddModal = false;
  displayEditModal = false;
  displayDeleteModal = false;
  cropsForm: FormGroup;
  transactionlist: Transaction[];
  selectedUserId: number;
  serialNumberArray: any[];
  public totalData = 0;
  noData: any
  items: MenuItem[] | undefined;
  customersList: Users[]
  farmersList: Users[]
  productsList: Product[]

  home: MenuItem | undefined;
  transectionType = [
    { name: 'Sale', value: 'sale' },
    { name: 'Purchase', value: 'purchase' }
  ];
  selectedTransaction: any;

  get f() {
    return this.cropsForm.controls;
  }
  constructor(private fb: FormBuilder, private data: DataService, private messageService: MessageService) {
    this.cropsForm = this.fb.group({
      productId: ['', [Validators.required]],
      selectedTransaction: ['sale', [Validators.required]],
      quantity: ['', [Validators.required]],
      price: ['', [Validators.required]],
      userId: ['', [Validators.required]],
    });
  }
  private fetchTransactionHistory(): void {
    this.transactionlist = [];
    this.serialNumberArray = [];
    this.data.getTransaction().subscribe(
      (res: Dictionary) => {
        console.log('API response:', res);
        if (res && res['status'] === 200) {
          this.transactionlist = res['data']
          this.transactionlist.forEach((user, index) => {
            user.srNo = index + 1;
          });
        }
      },
      (error) => {
        console.error('Error in API', error);
      });

  }
  ngOnInit() {
    this.fetchTransactionHistory();
    this.items = [{ label: 'Transactions' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.getCustomerUsers()
    this.getFarmerUsers()
    this.getProductsList()
    this.cropsForm.get('selectedTransaction').valueChanges.subscribe(value => {
      this.selectedTransaction = value;
    });
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
  getCustomerUsers() {
    const customerUser = 3
    if (customerUser) {
      this.data.getDropDownUsers(customerUser).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.customersList = res['data']
            // this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });

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
  getFarmerUsers() {
    const farmerUser = 4
    if (farmerUser) {
      this.data.getDropDownUsers(farmerUser).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.customersList = res['data']
            // this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });

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
  getProductsList() {
    this.data.getProductList().subscribe(
      (res: Dictionary) => {
        console.log('API response:', res);
        if (res && res['status'] === 200) {
          this.productsList = res['data']
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });

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
  ConfirmDelete() {
    if (this.selectedUserId) {
      this.data.deleteUser(this.selectedUserId).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
            this.fetchTransactionHistory()
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
            this.fetchTransactionHistory()
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
            this.fetchTransactionHistory()
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
