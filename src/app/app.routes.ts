import { Routes } from '@angular/router';
import { Signup } from './auth/signup/signup';
import { Login } from './auth/login/login';
import { Home } from './home/home';
import { isLoggedIn } from './is-logged-in-guard';
import { NewTodo } from './todo/new-todo/new-todo';
import { TodoView } from './todo/todo-view/todo-view';
import { TodoEdit } from './todo/todo-edit/todo-edit';
import { About } from './about/about';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    {
        path: 'signup',
        component: Signup
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: Home,
        canActivate: [isLoggedIn]
    },
    {
        path: 'todo/new',
        component: NewTodo,
        canActivate: [isLoggedIn]
    },
    {
        path: 'todo/:id',
        component: TodoView,
        canActivate: [isLoggedIn]
    },
    {
        path: 'todo/edit/:id',
        component: TodoEdit,
        canActivate: [isLoggedIn]
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [isLoggedIn]
    },
    {
        path: 'about',
        component: About
    }
];
