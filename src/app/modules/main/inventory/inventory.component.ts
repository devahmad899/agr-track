import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dictionary } from '@fullcalendar/core/internal';
import { MenuItem, MessageService } from 'primeng/api';
import { DataService, Stocks, Users } from 'src/app/core/core.index';
import { Product } from 'src/app/demo/api/product';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  products!: Product[];
  inventoryList: Stocks[];
  serialNumberArray: any[];
  public totalData = 0;
  noData: any
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  constructor(private data: DataService, private messageService: MessageService) {}
  private fetchIinventoryData(): void {
    this.serialNumberArray = [];
    this.data.getInventory().subscribe(
      (res: Dictionary) => {
        console.log('API response:', res);
        if (res && res['status'] === 200) {
          this.inventoryList = res['data']
          this.inventoryList.forEach((user, index) => {
            user.srNo = index + 1;
          });
        }
      },
      (error) => {
        console.error('Error in API', error);
      });

  }
  ngOnInit() {
    this.fetchIinventoryData();
    this.items = [{label: 'Inventory'}];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

}
