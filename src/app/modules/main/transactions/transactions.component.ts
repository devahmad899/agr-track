import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Dictionary } from '@fullcalendar/core/internal';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService, DataService, Transaction, Users } from 'src/app/core/core.index';
import { Product } from 'src/app/demo/api/product';
interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}
interface ExportColumn {
  title: string;
  dataKey: string;
}

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
  quantityControl = new FormControl();
  userRole: string = this.authService.roleName;
cols: Column[]
exportColumns!: ExportColumn[];
  home: MenuItem | undefined;
  transectionType = [
    { name: 'Sale', value: 'sale' },
    { name: 'Purchase', value: 'purchase' }
  ];
  selectedTransaction = 'sale';
  quantityInKgs: number;

  get f() {
    return this.cropsForm.controls;
  }
  constructor(private fb: FormBuilder, private data: DataService, private messageService: MessageService, private authService: AuthService) {
    this.cropsForm = this.fb.group({
      productId: ['', [Validators.required]],
      selectedTransaction: ['sale', [Validators.required]],
      quantity: ['', [Validators.required]],
      quantityInKg: [''],
      price: ['', [Validators.required]],
      commissionRate: [''],
      userId: ['', [Validators.required]],
      // commissionRate: ['',],
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
    this.cols = [
      { field: 'srNo.', header: 'Sr No.', customExportHeader: 'Sr No.' },
      { field: 'cropsName', header: 'Crops Name' },
      { field: 'saller', header: 'Saller' },
      { field: 'purchaser', header: 'Purchaser' },
      { field: 'saleRate', header: 'Sale Rate' },
      { field: 'purchaseRate', header: 'Purchase Rate' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'bill', header: 'Bill' },
  ];
  this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));

    this.fetchTransactionHistory();
    this.items = [{ label: 'Transactions' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.getCustomerUsers()
    this.getFarmerUsers()
    this.getProductsList()
    this.cropsForm.get('selectedTransaction').valueChanges.subscribe(value => {
      this.selectedTransaction = value;
    });
    // this.cropsForm.get('quantity').valueChanges.subscribe(value => {
    //   this.convertToKgs(value);
    // });
    // this.cropsForm.get('quantityinKg').valueChanges.subscribe(value => {
    //   this.convertToKgs(value);
    // });
    this.cropsForm.get('quantity').valueChanges.subscribe(() => {
      this.updateTotalQuantity();
    });

    this.cropsForm.get('quantityInKg').valueChanges.subscribe(() => {
      this.updateTotalQuantity();
    });
  }

  // Function to update the total quantity based on inputs in both fields
  updateTotalQuantity(): void {
    const quantityInMann = this.cropsForm.get('quantity').value;
    const quantityInKg = this.cropsForm.get('quantityInKg').value;

    if (quantityInMann || quantityInKg) {
      const convertedQuantityInKg = this.convertMannToKg(quantityInMann);
      // this.cropsForm.patchValue({ quantityInKg: convertedQuantityInKg + quantityInKg });
      this.quantityInKgs = quantityInKg + convertedQuantityInKg
    }
    else {
      this.quantityInKgs = null
      //   const convertedQuantityInMann = this.convertKgToMann(quantityInKg);
      //   this.cropsForm.patchValue({ quantity: convertedQuantityInMann });
    }
  }

  // Function to convert Mann to KG
  convertMannToKg(quantityInMann: number): number {
    // Your conversion logic goes here
    // For example, if 1 Mann = 40 KG
    const conversionFactor = 40;
    return quantityInMann * conversionFactor;
  }

  // Function to convert KG to Mann
  convertKgToMann(quantityInKg: number): number {
    // Your conversion logic goes here
    // For example, if 1 Mann = 40 KG
    const conversionFactor = 40;
    return quantityInKg / conversionFactor;
  }
  convertToKgs(quantity: number) {
    // Assuming the input quantity is in grams, convert it to kilograms
    this.quantityInKgs = quantity * 40; // Convert grams to kilograms
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
//   exportPdf() {
//     import('jspdf').then((jsPDF) => {
//         import('jspdf-autotable').then((x) => {
//             const doc = new jsPDF.default('p', 'px', 'a4');
//             (doc as any).autoTable(this.exportColumns, this.products);
//             doc.save('products.pdf');
//         });
//     });
// }
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
  confirmTransaction() {
    if (this.cropsForm && this.cropsForm.valid) {
      let formData = this.cropsForm.value;
      if (formData.selectedTransaction === "sale") {
        formData.sell = true;
        formData.purchase = false;
      } else {
        formData.sell = false;
        formData.purchase = true;
      }
      formData.quantity = this.convertKgToMann(this.quantityInKgs) || ''
      delete formData.selectedTransaction;
      delete formData.quantityInKg;
      console.log(formData, 'formdata')
      this.data.addStock(formData).subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.fetchTransactionHistory()
            this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
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
    this.cropsForm.reset();
    this.cropsForm.patchValue({
      selectedTransaction: 'sale'
    });
    this.quantityInKgs = null
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
}
