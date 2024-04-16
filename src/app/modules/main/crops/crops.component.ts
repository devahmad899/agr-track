import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dictionary } from '@fullcalendar/core/internal';
import { MenuItem, MessageService } from 'primeng/api';
import { DataService, Product, Users } from 'src/app/core/core.index';

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
  productList: Product[];
  selectedProductId: number;
  serialNumberArray: any[];
  public totalData = 0;
  noData: any
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;
  showLoader = false


  get f() {
    return this.cropsForm.controls;
  }
  constructor(private fb: FormBuilder, private data: DataService, private messageService: MessageService) {
    this.cropsForm = this.fb.group({
      name: ['', [Validators.required]],
      // AvailaibleQuantity: ['', [Validators.required]],
      // TotalQuantity: ['', [Validators.required]],
    });
  }
  private fetchCusotomerData(): void {
    this.productList = [];
    this.serialNumberArray = [];
    let id = 2
    this.showLoader = true
    this.data.getProduct().subscribe(
      (res: Dictionary) => {
        console.log('API response:', res);
        if (res && res['status'] === 200) {
          this.productList = res['data']
          this.productList.forEach((user, index) => {
            user.srNo = index + 1;
          });
          this.showLoader = false
        } else {
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
    if (this.selectedProductId) {
      this.data.deleteProduct(this.selectedProductId).subscribe(
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
  onSelectProduct(data: Product) {
    console.log(data, this.selectedProductId)
    this.selectedProductId = data.id
    console.log('selectedUser', this.selectedProductId)
    this.cropsForm.patchValue({
      name: data.name
    });
  }
  resetAll() {
    this.displayAddModal = false
    this.displayEditModal = false
    this.displayDeleteModal = false
    this.cropsForm.reset()
    this.selectedProductId = null
  }
  EditProduct() {
    if (this.cropsForm && this.cropsForm.valid) {
      let formData = this.cropsForm.value;
      console.log(formData)
      this.data.editProduct(this.selectedProductId, formData).subscribe(
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
  AddProduct() {
    if (this.cropsForm && this.cropsForm.valid) {
      let formData = this.cropsForm.value;;
      console.log(formData)
      this.data.addProduct(formData).subscribe(
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
