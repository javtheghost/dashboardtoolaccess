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
    selector: 'app-users-crud',
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
                    <h5 class="m-0 p-2">Administrar Usuarios</h5>

                </div>
                 <p-iconfield>

                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Buscar..." />
                    </p-iconfield>

            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th style="min-width: 16rem">Code</th>
                    <th pSortableColumn="name" style="min-width:16rem">
                        Nombres
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
                    <td>{{ product.price | currency: 'USD' }}</td>
                    <td>{{ product.category }}</td>
                    <td>
                        <p-rating [(ngModel)]="product.rating" [readonly]="true" />
                    </td>
                    <td>
                        <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" />
                    </td>
                    <td>
                     <p-button class="mr-2" (click)="editProduct(product)">
                        <ng-template pTemplate="icon">
                            <i class="material-symbols-outlined">edit</i>
                        </ng-template>
                        </p-button>

                        <!-- Botón de eliminar sin borde -->
                        <p-button severity="danger" (click)="deleteProduct(product)">
                        <ng-template pTemplate="icon">
                            <i class="material-symbols-outlined">delete</i>
                        </ng-template>
                        </p-button>
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <!-- Diálogo para crear/editar producto -->
       <!-- Diálogo para crear/editar producto -->
<p-dialog [(visible)]="productDialog" [style]="{ width: '450px' }" header="Product Details" [modal]="true">
    <ng-template #content>
        <div class="flex flex-col gap-6">
            <img [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + product.image" [alt]="product.image" class="block m-auto pb-4" *ngIf="product.image" />

            <div>
                <label for="name" class="block font-bold mb-3">Name</label>
                <input type="text" pInputText id="name" [(ngModel)]="product.name" required autofocus fluid />
                <small class="text-red-500" *ngIf="submitted && !product.name">Name is required.</small>
            </div>

            <div>
                <label for="description" class="block font-bold mb-3">Description</label>
                <textarea id="description" pTextarea [(ngModel)]="product.description" required rows="3" cols="20" fluid></textarea>
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
                    <div class="flex items-center gap-2 col-span-6">
                        <p-radiobutton id="category3" name="category" value="Electronics" [(ngModel)]="product.category" />
                        <label for="category3">Electronics</label>
                    </div>
                    <div class="flex items-center gap-2 col-span-6">
                        <p-radiobutton id="category4" name="category" value="Fitness" [(ngModel)]="product.category" />
                        <label for="category4">Fitness</label>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-6">
                    <label for="price" class="block font-bold mb-3">Price</label>
                    <p-inputnumber id="price" [(ngModel)]="product.price" mode="currency" currency="USD" locale="en-US" fluid />
                </div>
                <div class="col-span-6">
                    <label for="quantity" class="block font-bold mb-3">Quantity</label>
                    <p-inputnumber id="quantity" [(ngModel)]="product.quantity" fluid />
                </div>
            </div>
        </div>
    </ng-template>

    <ng-template #footer>
        <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()"></p-button>
        <p-button (click)="saveProduct()">
            <ng-template pTemplate="content">
                Save
            </ng-template>
        </p-button>
    </ng-template>
</p-dialog>


        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ProductService, ConfirmationService],
    styles: [`
    /* Estilo para los encabezados de la tabla */
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
        background-color: var(--secundary-color); /* Color azul oscuro */
        color: var(--primary-color); /* Texto en blanco para mejor contraste */
    }



    /* Opcional: Cambiar el estilo del icono de ordenación */
    :host ::ng-deep .p-datatable .p-sortable-column-icon {
        color: var(--primary-color);
    }

    /* Estilos para personalizar el toast */
    :host ::ng-deep .p-toast-message-success {
        background-color: white !important;
        color: #2E8B57 !important;
        border: 1px solid #2E8B57 !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
    }

    /* Oculta el ícono de check de PrimeNG */
    :host ::ng-deep .p-toast-message-success .p-toast-message-icon {
        display: none !important;
    }

    /* Muestra el ícono de Google Material Icons */
    :host ::ng-deep .p-toast-message-success .p-toast-message-content::before {
        content: "check_circle" !important;
        font-family: 'Material Icons' !important;
        font-size: 24px !important;
        color: #2E8B57 !important;
        margin-right: 8px !important;
    }

    /* Asegura que el contenido del toast se alinee correctamente */
    :host ::ng-deep .p-toast-message-success .p-toast-message-content {
        display: flex !important;
        align-items: center !important;
    }

    /* Estilos para el diálogo de confirmación */
    :host ::ng-deep .p-confirm-dialog .p-dialog-content .pi.pi-exclamation-triangle {
        display: none !important;
    }

    :host ::ng-deep .p-confirm-dialog .p-dialog-content::before {
        content: "check_circle" !important;
        font-family: 'Material Icons' !important;
        font-size: 24px !important;
        color: #2E8B57 !important;
        margin-right: 8px !important;
    }

    /* Estilo para eliminar ícono del botón Save */
    :host ::ng-deep .p-dialog-footer .p-button:not(.p-button-icon-only) .p-button-icon-left {
        display: none !important;
    }

    /* Estilos para los diálogos de confirmación personalizados */
    :host ::ng-deep .p-confirm-dialog .p-dialog-content {
        padding: 1.5rem;
        text-align: center;
    }

    :host ::ng-deep .p-confirm-dialog .p-dialog-header {
        display: none;
    }

    :host ::ng-deep .p-confirm-dialog .p-dialog-footer {
        display: flex;
        justify-content: center;
        gap: 1rem;
        padding: 1rem;
    }

    :host ::ng-deep .p-confirm-dialog .p-confirm-dialog-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    /* Estilo para el icono de alerta circular (eliminación) */
    .alert-circ-icon::before {
        content: "error_outline";
        font-family: 'Material Icons';
        font-size: 48px;
        color: #F44336;
    }

    /* Estilo para el icono de alerta exterior (operación general) */
    .alert-out-icon::before {
        content: "warning_amber";
        font-family: 'Material Icons';
        font-size: 48px;
        color: #FF9800;
    }

    /* Estilo para los botones de confirmación */
    :host ::ng-deep .p-confirm-dialog .p-button {
        min-width: 100px;
        border-radius: 4px;
    }

    :host ::ng-deep .p-confirm-dialog .p-button-text {
        border: 1px solid #ccc;
    }



`]
})
export class UserCrudComponent implements OnInit {
    productDialog: boolean = false;
    products = signal<Product[]>([]);
    product!: Product;
    selectedProducts?: Product[] | null;
    submitted: boolean = false;
    statuses?: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns?: ExportColumn[];
    cols?: Column[];

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

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
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
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
    message: `
      <div style="display: flex; justify-content: center; align-items: center; width: 100%; min-height: 80px; margin-bottom: 16px;">
        <i class="material-symbols-outlined text-red-600 text-6xl" style="display: block;">delete</i>
      </div>
      <div style="text-align: center;">
        <strong>¿Estás seguro de eliminar ${product.name}?</strong>
        <p style="margin-top: 8px;">Una vez que aceptes, no podrás revertir los cambios.</p>
      </div>
    `,
    accept: () => {
      this.products.set(this.products().filter((val) => val.id !== product.id));
      this.product = {};
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Producto eliminado',
        life: 3000
      });
    },
    rejectLabel: 'Cancelar',
    acceptLabel: 'Aceptar',
       rejectButtonStyleClass: 'p-button-outlined p-button-secondary', // outlined gris
    acceptButtonStyleClass: 'p-button p-button-danger' // fondo rojo

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
        console.log('Guardando producto:', this.product); // Depuración
        let _products = this.products();

        if (this.product.name?.trim()) {
            if (this.product.id) {
                this.confirmationService.confirm({
                    message: `Do you want to save changes to ${this.product.name}? This will update the product details.`,
                    header: 'Confirm Update',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        _products[this.findIndexById(this.product.id!)] = this.product;
                        this.products.set([..._products]);
                        this.messageService.add({

                            severity: 'success',
                            summary: 'Success',
                            detail: `Updated ${this.product.name} successfully!`,
                            life: 3000
                        });
                        this.productDialog = false;
                        this.product = {};
                    },
                    reject: () => {
                        console.log('Actualización cancelada'); // Depuración
                    }
                });
            } else {
                this.product.id = this.createId();
                this.product.image = 'product-placeholder.svg';
                this.products.set([..._products, this.product]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Created ${this.product.name} successfully!`,
                    life: 3000
                });
                this.productDialog = false;
                this.product = {};
            }
        } else {
            console.log('Error: El nombre del producto es requerido'); // Depuración
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Name is required',
                life: 3000
            });
        }
    }
}
