import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, PrimeNGConfig, OverlayOptions } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { OverlayModule } from 'primeng/overlay';
import { Router } from '@angular/router';
import { routes } from '../core/core.index';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styles: [`
        .layout-topbar .layout-topbar-logo img {
                height: 3.5rem;
                /* width: 100%;
                height: 75%;
                object-fit: contain; */
            }
        .layout-topbar .layout-topbar-logo span {
                font-size: 1.8rem;
            }
    `]

})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private primengConfig: PrimeNGConfig, private router : Router) { }
    ngOnInit() {
        this.items = [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    this.update();
                }
            },
            {
                label: 'Log Out',
                icon: 'pi-sign-out',
                command: () => {
                    this.logout();
                }
            }
        ];
    }

    update() {
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Updated' });
    }

    logout() {
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');
        this.router.navigate([routes.login]);
      }
}
