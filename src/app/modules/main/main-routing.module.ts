import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { FarmersComponent } from './farmers/farmers.component';
import { EmployeesComponent } from './employees/employees.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { CropsComponent } from './crops/crops.component';
import { AccountabilityComponent } from './accountability/accountability.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { InventoryComponent } from './inventory/inventory.component';
import { SaleComponent } from './sale/sale.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';



@NgModule({
  imports: [RouterModule.forChild([
    { path: 'customer',component: CustomersComponent, data: { breadcrumb: 'Menu' } },
    { path: 'farmers',component: FarmersComponent, data: { breadcrumb: 'Menu' } },
    { path: 'employees',component: EmployeesComponent, data: { breadcrumb: 'Menu' } },
    { path: 'crops',component: CropsComponent, data: { breadcrumb: 'Menu' } },
    { path: 'crops/inventory',component: InventoryComponent, data: { breadcrumb: 'Menu' } },
    { path: 'crops/sale',component: SaleComponent, data: { breadcrumb: 'Menu' } },
    { path: 'crops/purchase',component: PurchaseComponent, data: { breadcrumb: 'Menu' } },
    { path: 'accountability',component: AccountabilityComponent, data: { breadcrumb: 'Menu' } },
    { path: 'configuration',component: ConfigurationComponent, data: { breadcrumb: 'Menu' } },
    { path: 'system-settings',component: SystemSettingsComponent, data: { breadcrumb: 'Menu' } },
    { path: 'user-profile',component: UserProfileComponent, data: { breadcrumb: 'Menu' } },
    { path: 'change-password',component: ChangePasswordComponent, data: { breadcrumb: 'Menu' } },
])],
exports: [RouterModule]
})
export class MainRoutingModule { }
