import { Routes } from '@angular/router';
import { Signup } from './auth/signup/signup';
import { Login } from './auth/login/login';

export const routes: Routes = [
    {
        path: 'signup',
        component: Signup
    },
    {
        path: 'login',
        component: Login
    }
];
