import { Routes } from '@angular/router';
import { authRoutes } from "./core/auth/auth.routes";
import { layoutRoutes } from "./core/layout/layout.routes";

export const routes: Routes = [...authRoutes, ...layoutRoutes];
