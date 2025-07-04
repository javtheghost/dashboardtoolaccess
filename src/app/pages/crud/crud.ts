import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '../service/product.service';

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
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    template: `
        <p-toast></p-toast>

        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedProducts()" [disabled]="!selectedProducts || !selectedProducts.length" />
            </ng-template>
            <ng-template #end>
                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="products()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedProducts"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0 p-2">Administrar Herramientas</h5>
                </div>

                <div class="flex items-center justify-between gap-4 mt-2">
                    <p-iconfield class="flex-1">
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Buscar..." />
                    </p-iconfield>

                    <!-- Botón alineado a la derecha -->
                    <div class="flex justify-end">
                        <p-button label="Crear Herramienta" icon="pi pi-plus" (onClick)="openNew()"></p-button>
                    </div>
                </div>
            </ng-template>

            <!-- Botón para crear nueva subcategoría -->
            <ng-template #header>
                <tr>
                 
                    <th style="min-width: 16rem">Code</th>
                    <th pSortableColumn="name" style="min-width:16rem">
                        Name
                        <p-sortIcon field="name" />
                    </th>
                    <th>Image</th>
                    <th pSortableColumn="price" style="min-width: 8rem">
                        Price
                        <p-sortIcon field="price" />
                    </th>
                    <th pSortableColumn="category" style="min-width:10rem">
                        Category
                        <p-sortIcon field="category" />
                    </th>
                    <th pSortableColumn="rating" style="min-width: 12rem">
                        Reviews
                        <p-sortIcon field="rating" />
                    </th>
                    <th pSortableColumn="inventoryStatus" style="min-width: 12rem">
                        Status
                        <p-sortIcon field="inventoryStatus" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-product>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="product" />
                    </td>
                    <td style="min-width: 12rem">{{ product.code }}</td>
                    <td style="min-width: 16rem">{{ product.name }}</td>
                    <td>
                        <img [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + product.image" [alt]="product.name" style="width: 64px" class="rounded" />
                    </td>
                    <td>{{ product.price | currency: 'MXN' }}</td>
                    <td>{{ product.category }}</td>
                    <td>
                        <p-rating [(ngModel)]="product.rating" [readonly]="true" />
                    </td>
                    <td>
                        <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" />
                    </td>
                    <td>
                        <!-- Botón Editar (opcional azul) -->
                        <p-button (click)="editProduct(product)" styleClass="custom-flat-icon-button custom-flat-icon-button-edit mr-2">
                            <ng-template pTemplate="icon">
                                <i class="material-symbols-outlined">edit</i>
                            </ng-template>
                        </p-button>

                        <!-- Botón Eliminar (solo ícono rojo sin fondo) -->
                        <p-button (click)="deleteProduct(product)" styleClass="custom-flat-icon-button custom-flat-icon-button-delete">
                            <ng-template pTemplate="icon">
                                <i class="material-symbols-outlined">delete</i>
                            </ng-template>
                        </p-button>
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <!-- Diálogo para crear/editar producto -->
        <p-dialog [(visible)]="productDialog" [style]="{ width: '450px' }" header="Nueva Herramienta" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <img [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + product.image" [alt]="product.image" class="block m-auto pb-4" *ngIf="product.image" />

                    <div></div>
                    <div class="relative">
                        <!-- Ícono alineado -->
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 pointer-events-none peer-focus:text-[var(--primary-color)] dark:peer-focus:text-[var(--primary-color)]">
                            edit
                        </span>

                        <!-- Input -->
                        <input
                            type="text"
                            id="name"
                            name="name"
                            inputmode="text"
                            required
                            class="peer block w-full h-12 appearance-none rounded-lg border border-gray-300 bg-transparent px-10 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] dark:border-gray-600 dark:text-white dark:focus:border-[var(--primary-color)] dark:focus:ring-[var(--primary-color)]"
                            placeholder=" "
                            aria-label="Nombre"
                            [(ngModel)]="product.name"
                        />

                        <!-- Label flotante -->
                        <label
                            for="name"
                            class="absolute left-10 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-600 duration-300
      peer-placeholder-shown:left-10 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
      peer-focus:left-3 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-[var(--primary-color)]
      dark:text-gray-400 dark:peer-focus:text-[var(--primary-color)] bg-white px-1 dark:bg-gray-800"
                        >
                            Nombre
                        </label>
                    </div>

                    <div class="relative">
                        <!-- Ícono alineado -->
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 pointer-events-none peer-focus:text-[var(--primary-color)] dark:peer-focus:text-[var(--primary-color)]">
                            payments
                        </span>

                        <!-- Input -->
                        <input
                            type="text"
                            id="payment"
                            name="payment"
                            inputmode="text"
                            required
                            class="peer block w-full h-12 appearance-none rounded-lg border border-gray-300 bg-transparent px-10 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] dark:border-gray-600 dark:text-white dark:focus:border-[var(--primary-color)] dark:focus:ring-[var(--primary-color)]"
                            placeholder=" "
                            aria-label="Payment"
                        />

                        <!-- Label flotante -->
                        <label
                            for="payment"
                            class="absolute left-10 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-600 duration-300
      peer-placeholder-shown:left-10 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
      peer-focus:left-3 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-[var(--primary-color)]
      dark:text-gray-400 dark:peer-focus:text-[var(--primary-color)] bg-white px-1 dark:bg-gray-800"
                        >
                            Payment
                        </label>
                    </div>

                    <div>
                        <label for="inventoryStatus" class="block font-bold mb-3">Inventory Status</label>
                        <p-select [(ngModel)]="product.inventoryStatus" inputId="inventoryStatus" [options]="statuses" optionLabel="label" optionValue="label" placeholder="Select a Status" fluid />
                    </div>

                    <div>
                        <span class="block font-bold mb-4">Category</span>
                        <div class="grid grid-cols-12 gap-4">
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category1" name="category" value="Accessories" [(ngModel)]="product.category" />
                                <label for="category1">Accessories</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category2" name="category" value="Clothing" [(ngModel)]="product.category" />
                                <label for="category2">Clothing</label>
                            </div>
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()"></p-button>
                <p-button (click)="saveProduct()">
                    <ng-template pTemplate="content"> Guardar </ng-template>
                </p-button>
            </ng-template>
        </p-dialog>

        <p-confirmDialog [style]="{ width: '350px' }" [draggable]="false">
            <ng-template pTemplate="header">
                <div style="text-align: center; padding: 1rem 0;">
                    <span class="material-symbols-outlined" [ngStyle]="{ fontSize: '60px', color: confirmIconColor }">
                        {{ confirmIcon }}
                    </span>
                </div>
            </ng-template>

            <ng-template pTemplate="footer" let-accept let-reject>
                <div class="flex justify-center gap-3">
                    <button pButton type="button" label="Cancelar" class="p-button-outlined" (click)="reject()"></button>
                    <button
                        pButton
                        type="button"
                        label="Aceptar"
                        [ngClass]="{
                            'custom-confirm-button-delete': confirmIcon === 'delete',
                            'custom-confirm-button-warning': confirmIcon === 'warning'
                        }"
                        (click)="accept()"
                    ></button>
                </div>
            </ng-template>
        </p-confirmDialog>
    `,
    providers: [MessageService, ProductService, ConfirmationService],
    styles: [``]
})
export class Crud implements OnInit {
    productDialog: boolean = false;
    products = signal<Product[]>([]);
    product!: Product;
    selectedProducts?: Product[] | null;
    submitted: boolean = false;
    statuses?: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns?: ExportColumn[];
    cols?: Column[];

    // Nuevas propiedades para el ícono dinámico
    confirmIcon: string = 'delete';
    confirmIconColor: string = '#D9534F'; // rojo para delete por defecto

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.productService.getProducts().then((data) => {
            this.products.set(data);
        });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmIcon = 'delete';
        this.confirmIconColor = '#D9534F';

        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            header: 'Confirmar eliminación',
            message: `¿Estás seguro de eliminar ${product.name}?`,
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.products.set(this.products().filter((val) => val.id !== product.id));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Producto eliminado',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products().length; i++) {
            if (this.products()[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    saveProduct() {
        this.submitted = true;
        let _products = this.products();

        if (this.product.name?.trim()) {
            if (this.product.id) {
                this.confirmIcon = 'warning';
                this.confirmIconColor = '#FFA726'; // color ámbar para advertencia

                this.confirmationService.confirm({
                    message: `¿Estás seguro que deseas continuar con esta operación?<br><small>Una vez que aceptes, los cambios reemplazarán la información actual.</small>`,
                    header: 'Confirmar Actualización',
                    acceptButtonStyleClass: 'p-button-warning custom-accept-button',
                    rejectButtonStyleClass: 'p-button-text',
                    acceptLabel: 'Aceptar',
                    rejectLabel: 'Cancelar',
                    accept: () => {
                        _products[this.findIndexById(this.product.id!)] = this.product;
                        this.products.set([..._products]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: `¡${this.product.name} actualizado correctamente!`,
                            life: 3000
                        });
                        this.productDialog = false;
                        this.product = {};
                    }
                });
            } else {
                this.product.id = this.createId();
                this.product.image = 'product-placeholder.svg';
                this.products.set([..._products, this.product]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `¡${this.product.name} creado correctamente!`,
                    life: 3000
                });
                this.productDialog = false;
                this.product = {};
            }
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El nombre es requerido',
                life: 3000
            });
        }
    }
}
