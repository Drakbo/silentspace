import { Routes } from '@angular/router'
import { authGuard } from './core/guards/auth.guard'
import { adminGuard } from './core/guards/admin.guard'

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'resources',
    loadComponent: () =>
      import('./features/resources/resources').then(m => m.Resources)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'log-mood',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/mood-log/mood-log').then(m => m.MoodLog)
  },
  {
    path: 'coping-tip',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/coping-tip/coping-tip').then(m => m.CopingTip)
  },
  {
    path: 'mood-history',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/mood-history/mood-history').then(m => m.MoodHistory)
  },
  {
    path: 'admin/dashboard',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'admin/resources',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/resource-management/resource-management').then(m => m.ResourceManagement)
  },
  {
    path: 'admin/mood-logs',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/mood-logs/mood-logs').then(m => m.MoodLogs)
  },

  { path: '**', redirectTo: '/login' }
]