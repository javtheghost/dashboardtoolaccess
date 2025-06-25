import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import {  UserCrudComponent } from './users/users-crud';

export default [
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    {path: 'categories-list', component:CategoriesListComponent},
    {path: 'users-list', component:UserCrudComponent},


    { path: '**', redirectTo: '/notfound' },
] as Routes;
