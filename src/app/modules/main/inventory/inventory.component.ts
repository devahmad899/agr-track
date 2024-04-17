import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dictionary } from '@fullcalendar/core/internal';
import { MenuItem, MessageService } from 'primeng/api';
import { DataService, Stocks, Store, Users } from 'src/app/core/core.index';
import { Product } from 'src/app/demo/api/product';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  products!: Product[];
  inventoryList: Stocks[];
  storeList: Store[];
  storeSerialNumberArray: any[];
  serialNumberArray: any[];
  public totalData = 0;
  noData: any
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  displayAddModal: boolean;
  displayDetailModal: boolean;
  displayEditModal: boolean;
  displayDeleteModal: boolean;
  selectedUserId: number;
  storeForm: FormGroup;
  showLoader = false
  inventoryLoader = false
  get f() {
    return this.storeForm.controls;
  }
  constructor(private data: DataService, private messageService: MessageService, private fb: FormBuilder) {
    this.storeForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
  }
  private fetchIinventoryStore(): void {
    this.storeSerialNumberArray = [];
    this.showLoader = true
    this.data.getStore().subscribe(
      (res: Dictionary) => {
        console.log('API response:', res);
        if (res && res['status'] === 200) {
          this.storeList = res['data']
          this.storeList.forEach((user, index) => {
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
  private fetchIinventoryDetail(id: number): void {
    this.serialNumberArray = [];
    this.inventoryLoader = true
    this.data.storeDetails(id).subscribe(
      (res: Dictionary) => {
        console.log('API response:', res);
        this.inventoryLoader = false
        if (res && res['status'] === 200) {
          this.inventoryList = res['data']
          this.inventoryList.forEach((user, index) => {
            user.srNo = index + 1;
          });
        }
      },
      (error) => {
        this.inventoryLoader = false
        console.error('Error in API', error);
      });

  }
  onSelectUser(data: Store) {
    console.log(data, this.selectedUserId)
    this.selectedUserId = data.id
    console.log('selectedUser', this.selectedUserId)
    this.storeForm.patchValue({
      name: data.name,
      address: data.address,
    });
  }
  onSelectID(id: number) {
    console.log('i am triggered')
    this.selectedUserId = id;
    this.fetchIinventoryDetail(this.selectedUserId)
  }
  ShowModal(id: number) {
    if (id === 1) {
      this.displayAddModal = true;
    } else if (id === 2) {
      this.displayEditModal = true;
    } else if (id === 4) {
      this.displayDetailModal = true;
    } else {
      this.displayDeleteModal = true;
    }
  }
  resetAll() {
    this.inventoryList = [];
    this.displayAddModal = false
    this.displayDetailModal = false
    this.displayEditModal = false
    this.displayDeleteModal = false
    this.storeForm.reset()
    this.selectedUserId = null
  }
  ngOnInit() {
    this.fetchIinventoryStore()
    this.items = [{ label: 'Stock' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
  AddStore() {
    if (this.storeForm && this.storeForm.valid) {
      let formData = this.storeForm.value;
      console.log(formData)
      this.data.addStore(formData).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.fetchIinventoryStore()
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
            this.resetAll()

          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res['message'] });
            this.resetAll()
          }
        },
        (error) => {
          this.displayAddModal = false
          this.resetAll()
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

          console.error('Error in API', error);
        });
    }
  }
  EditStore() {
    if (this.storeForm && this.storeForm.valid) {
      let formData = this.storeForm.value;
      console.log(formData)
      this.data.editStore(this.selectedUserId, formData).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
            this.fetchIinventoryStore()
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
  ConfirmDelete() {
    if (this.selectedUserId) {
      this.data.deleteStore(this.selectedUserId).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
            this.fetchIinventoryStore()
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
