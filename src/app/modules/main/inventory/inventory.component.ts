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
  inventorykList: Stocks[];
  serialNumberArray: any[];
  public totalData = 0;
  noData: any
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  constructor(private data: DataService, private messageService: MessageService) {}
  private fetchCusotomerData(): void {
    this.serialNumberArray = [];
    this.data.getInventory().subscribe(
      (res: Dictionary) => {
        console.log('API response:', res);
        if (res && res['status'] === 200) {
          this.inventorykList = res['data']
          this.inventorykList.forEach((user, index) => {
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
    this.items = [{ label: 'Crops'}, {label: 'Inventory'}];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

}
