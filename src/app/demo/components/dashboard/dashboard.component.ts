import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService, DataService, UsersStats } from 'src/app/core/core.index';
import { Dictionary } from '@fullcalendar/core/internal';

@Component({
    templateUrl: './dashboard.component.html',
    providers: [MessageService]
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];

    products!: Product[];
    usersCount!: Dictionary

    chartData: any;

    chartOptions: any;
    doughnutChartData: any;
    doughnutChartOptions: any;
    rolenName = '';

    subscription!: Subscription;
    sale: string
    purchase: string

    constructor(private productService: ProductService, private authService: AuthService, public layoutService: LayoutService, private data: DataService, private messageService: MessageService) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ngOnInit() {
        this.rolenName = this.authService.roleName
        this.fetchUsersStats()
        this.initChart();
        // this.initDoughnutChart({ customers: 1, farmers: 1, employees: 1 });
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
        this.getSalePurchase()
    }
    getSalePurchase() {
        this.data.getSalePurchase().subscribe(
            (res: Dictionary) => {
                // console.log('API response:', res);
                if (res && res['status'] === 200) {
                    this.sale = res['sale']
                    this.purchase = res['purchase']
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
    fetchUsersStats() {
        this.data.getUsersStats().subscribe(
            (res: Dictionary) => {
                // console.log('API response:', res);

                this.usersCount = res
                this, this.initDoughnutChart(this.usersCount)
                console.log('API usercount:', this.usersCount);

                // this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
            },
            (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
                console.error('Error in API', error);
            });
    }
    initDoughnutChart(data: { [key: string]: number }) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.doughnutChartData = {
            labels: Object.keys(data),
            datasets: [
                {
                    data: Object.values(data),
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
                }
            ]
        };
        this.doughnutChartOptions = {
            cutout: '60%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };
    }
    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
