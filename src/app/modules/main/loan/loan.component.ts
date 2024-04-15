import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Dictionary } from '@fullcalendar/core/internal';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService, DataService, GetLoans, Transaction, Users } from 'src/app/core/core.index';
import { Product } from 'src/app/demo/api/product';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrl: './loan.component.scss'
})
export class LoanComponent {
  products!: Product[];
  displayAddModal = false;
  displayEditModal = false;
  displayReceivedModal = false;
  loanForm: FormGroup;
  loanList: Transaction[];
  selectedUserId: number;
  serialNumberArray: any[];
  public totalData = 0;
  noData: any
  items: MenuItem[] | undefined;
  customersList: Users[]
  farmersList: Users[]
  productsList: Product[]
  quantityControl = new FormControl();
  userRole: string = this.authService.roleName;


  home: MenuItem | undefined;
  transectionType = [
    { name: 'Sale', value: 'sale' },
    { name: 'Purchase', value: 'purchase' }
  ];
  selectedTransaction = 'sale';
  quantityInKgs: number;

  get f() {
    return this.loanForm.controls;
  }
  constructor(private fb: FormBuilder, private data: DataService, private messageService: MessageService, private authService: AuthService) {
    this.loanForm = this.fb.group({
      userId: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      commissionRate: ['', [Validators.required]],
      description: ['', [Validators.required]],
      // commissionRate: ['',],
    });
  }
  private fetchLoans(): void {
    this.loanList = [];
    this.serialNumberArray = [];
    this.data.getLoans().subscribe(
      (res: Dictionary) => {
        console.log('API response:', res);
        if (res && res['status'] === 200) {
          this.loanList = res['data']
          this.loanList.forEach((user, index) => {
            user.srNo = index + 1;
          });
        }
      },
      (error) => {
        console.error('Error in API', error);
      });

  }
  ngOnInit() {
    this.fetchLoans();
    this.items = [{ label: 'Loans' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.getFarmerUsers()
  }
  ShowModal(id: number) {
    if (id === 1) {
      this.displayAddModal = true;
    } else if (id === 2) {
      this.displayEditModal = true;
    } else {
      this.displayReceivedModal = true
    }
  }
  getFarmerUsers() {
    const farmerUser = 4
    if (farmerUser) {
      this.data.getDropDownUsers(farmerUser).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            console.log(res['data'])
            this.farmersList = res['data']
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
  addLoan() {
    if (this.loanForm && this.loanForm.valid) {
      let formData = this.loanForm.value;
      // if (formData.selectedTransaction === "sale") {
      //   formData.sell = true;
      //   formData.purchase = false;
      // } else {
      //   formData.sell = false;
      //   formData.purchase = true;
      // }
      // delete formData.selectedTransaction;
      console.log(formData, 'formdata')
      this.data.addLoan(formData).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.fetchLoans()
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
            this.displayAddModal = false
            this.resetAll()
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res['message'] });
            this.displayAddModal = false
            this.loanForm.reset()
          }
        },
        (error) => {
          this.displayAddModal = false
          this.loanForm.reset()
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

          console.error('Error in API', error);
        });
    }
  }
  onSelectID(id: number) {
    this.selectedUserId = id;
  }
  ConfirmReceived() {
    if (this.selectedUserId) {
      this.data.deleteUser(this.selectedUserId).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
            this.fetchLoans()
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
    this.loanForm.reset();
    this.selectedUserId = null
  }
  EditUser() {
    if (this.loanForm && this.loanForm.valid) {
      let formData = this.loanForm.value;
      console.log(formData)
      this.data.editUser(this.selectedUserId, formData).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
            this.fetchLoans()
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
}
