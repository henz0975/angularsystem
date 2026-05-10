import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
  path: 'register',
  loadComponent: () =>
    import('./pages/register/register')
    .then(m => m.Register)
},

  {
  path: 'dashboard',
  component: Dashboard,
  canActivate: [authGuard]
}

];