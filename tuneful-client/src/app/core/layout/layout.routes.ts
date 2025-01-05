import { Routes } from '@angular/router';
import { authGuard } from '../../shared/guards/auth.guard';
import { EditComponent } from './edit/edit.component';
import { HomeComponent } from './home/home.component';
import { InformationComponent } from './information/information.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SettingsComponent } from './settings/settings.component';

export const layoutRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent, canActivate: [authGuard] },
      { path: 'edit', component: EditComponent, canActivate: [authGuard] },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'help',
        component: InformationComponent,
        canActivate: [authGuard],
      },
      { path: '**', redirectTo: '/home', pathMatch: 'full' },
    ],
  },
];
