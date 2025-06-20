import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { CategoriesListComponent } from './categories-list/categories-list.component';

export default [
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    {path: 'categories-list', component:CategoriesListComponent},

    { path: '**', redirectTo: '/notfound' },
] as Routes;
