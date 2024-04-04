import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, PrimeNGConfig, OverlayOptions } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { OverlayModule } from 'primeng/overlay';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styles: [`
        .layout-topbar .layout-topbar-logo img {
                margin-right: 0.5rem;
                width: 100%;
                height: 75%;
                object-fit: contain;
            }
        .layout-topbar .layout-topbar-logo  {
                height: 100%;
            }
    `]

})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private primengConfig: PrimeNGConfig) { }

}
