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
import { TransactionsComponent } from './transactions/transactions.component';
import { AuthRoleGuard } from 'src/app/core/services/auth-role.guard';



@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'customer', component: CustomersComponent,
      canActivate: [AuthRoleGuard],
      data: {
        breadcrumb: 'Menu',
        expectedRoles: ['Admin']
      }
    },
    {
      path: 'farmers', component: FarmersComponent,
      canActivate: [AuthRoleGuard],
      data: {
        breadcrumb: 'Menu',
        expectedRoles: ['Admin']
      }
    },
    {
      path: 'employees', component: EmployeesComponent,
      canActivate: [AuthRoleGuard],
      data: {
        breadcrumb: 'Menu',
        expectedRoles: ['Admin']
      }
    },
    {
      path: 'crops', component: CropsComponent,
      canActivate: [AuthRoleGuard],
      data: {
        breadcrumb: 'Menu',
        expectedRoles: ['Admin', 'Employee']
      }
    },
    {
      path: 'stock', component: InventoryComponent,
      canActivate: [AuthRoleGuard],
      data: {
        breadcrumb: 'Menu',
        expectedRoles: ['Admin', 'Employee']
      }
    },
    {
      path: 'accountability', component: AccountabilityComponent,
      canActivate: [AuthRoleGuard],
      data: {
        breadcrumb: 'Menu',
        expectedRoles: ['Admin', 'Employee']
      }
    },
    {
      path: 'system-settings', component: SystemSettingsComponent,
      data: {
        breadcrumb: 'Menu',
      }
    },
    {
      path: 'user-profile', component: UserProfileComponent,
      data: {
        breadcrumb: 'Menu',
      }
    },
    {
      path: 'change-password', component: ChangePasswordComponent,
      data: {
        breadcrumb: 'Menu'
      }
    },
    {
      path: 'transactions', component: TransactionsComponent,

      data: {
        breadcrumb: 'Menu',

      }
    },
  ])],
  exports: [RouterModule]
})
export class MainRoutingModule { }
