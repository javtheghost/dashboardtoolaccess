import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{
                    label: 'Inicio',
                    icon: 'material-symbols-outlined',
                    iconText: 'home',
                    routerLink: ['/'],
                }
                ]
            },

            {
                label: 'Gestión',
                icon: 'material-symbols-outlined',
                routerLink: ['/pages'],
                items: [

                    {
                        label: 'Usuarios',
                        icon: 'material-symbols-outlined',
                        items: [
                            {
                                label: 'Usuarios',
                                icon: 'material-symbols-outlined',
                                iconText: 'groups',
                                routerLink: ['/pages/users-list']
                            },
                             {
                                label: 'Roles',
                                icon: 'material-symbols-outlined',
                                iconText: 'groups',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },

                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    }
                ]
            },
            {
                label: 'Herramientas',
                items: [
                    {
                        label: 'Ver lista de herramientas',
                        iconText: 'construction',
                        icon: 'material-symbols-outlined',

                        routerLink: ['/pages/crud'],
                    }
                ]
            },
            {
                items: [
                    {
                        label: 'Categorías',
                        iconText: 'inventory_2',
                        icon: 'material-symbols-outlined',

                        routerLink: ['/pages/categories-list'],
                    }
                ],

            },
            {
                items: [
                    {
                        label: 'Multas y Daños',
                        iconText: 'gavel',
                        icon: 'material-symbols-outlined',

                        routerLink: ['/pages/crud'],
                    }
                ],

            },

            {
                items: [
                    {
                        label: 'Perfil',
                        iconText: 'person',
                        icon: 'material-symbols-outlined',

                        routerLink: [''],
                    }
                ],

            },
            {
                items: [
                    {
                        label: 'Cerrar sesión',
                        iconText: 'logout',
                        icon: 'material-symbols-outlined',

                        routerLink: [''],
                    }
                ],

            },
        ];
    }
}
