import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, PrimeNGConfig, OverlayOptions } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { OverlayModule } from 'primeng/overlay';
import { Router } from '@angular/router';
import { DataService, Profile, routes } from '../core/core.index';
import { Dictionary } from '@fullcalendar/core/internal';
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
            .profile-img-wrap {
            height: 30px;
            width: 30px;
            overflow: hidden;
            text-align: center;
            border-radius: 50%;
                
            img {
                width:100%;
            }
            }

    `]

})
export class AppTopBarComponent {

    items!: MenuItem[];
    userData : Profile
    profilePic : string
    public routes = routes;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private primengConfig: PrimeNGConfig, private router: Router, private data: DataService) { }
    ngOnInit() {
        this.getProfileData()
        this.items = [
            {
                label: 'Change Password',
                icon: 'pi pi-lock',
                command: () => {
                    this.router.navigate([routes.changePassword])
                }
            },
            {
                label: 'Log Out',
                icon: 'pi pi-sign-out',
                command: () => {
                    this.logOut();
                }
            }
        ];
    }
getProfileData() {
    this.data.getProfile().subscribe(
        (res: Dictionary) => {
          console.log('API response:', res);
          if (res && res['status'] === 200) {
            this.userData = res['data']
            this.profilePic =  this.userData[0].profilePicture
          }
        },
        (error) => {
          console.error('Error in API', error);
        });
}
    update() {
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Updated' });
    }

    logOut() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('roleName');
        sessionStorage.removeItem('access_token');
        this.router.navigate([routes.login]);
    }
}
