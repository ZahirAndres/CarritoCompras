import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { RegisterComponent } from './componentes/register/register.component';
import { HomeComponent } from './componentes/home/home.component';
import { authGuard } from './guards/auth.guard';
import { VerProductosComponent } from './componentes/productos/ver-productos/ver-productos.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path : 'perfil',
    component: PerfilComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'home',
    component: VerProductosComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
