import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { TableModule } from 'primeng/table';
import { CustomersComponent } from './customers/customers.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MessageService } from 'primeng/api';
import { FarmersComponent } from './farmers/farmers.component';
import { EmployeesComponent } from './employees/employees.component';
import { CropsComponent } from './crops/crops.component';
import { InventoryComponent } from './inventory/inventory.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { SaleComponent } from './sale/sale.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PasswordModule } from 'primeng/password';
import { TransactionsComponent } from './transactions/transactions.component';
import {SelectButtonModule} from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccountabilityComponent } from './accountability/accountability.component';
import { ReportsComponent } from './reports/reports.component';
import { LoanComponent } from './loan/loan.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@NgModule({
  declarations: [
    CustomersComponent,
    FarmersComponent,
    EmployeesComponent,
    CropsComponent,
    InventoryComponent,
    PurchaseComponent,
    SaleComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    TransactionsComponent,
    AccountabilityComponent,
    ReportsComponent,
    LoanComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    TableModule,
    ButtonModule,
    RippleModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    InputMaskModule,
    ToastModule,
    BreadcrumbModule,
    PasswordModule,
    DropdownModule,
    SelectButtonModule,
    InputNumberModule,
    ProgressSpinnerModule
    
  ],
  providers: [MessageService]
})
export class MainModule { }
