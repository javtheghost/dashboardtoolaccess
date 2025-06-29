import { Routes } from '@angular/router';
import { Access } from './access';
import { Error } from './error';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyCodeComponent } from './verifycode/verifycode.component';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: LoginComponent },

    { path: 'register', component: RegisterComponent },
    {path: 'verifycode', component:VerifyCodeComponent}

] as Routes;
