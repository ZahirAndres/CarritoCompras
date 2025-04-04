import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { RegisterComponent } from './componentes/register/register.component';
import { HomeComponent } from './componentes/home/home.component';
import { authGuard } from './guards/auth.guard';
import { VerProductosComponent } from './componentes/productos/ver-productos/ver-productos.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { CarritoComponent } from './componentes/compras/carrito/carrito.component';
import { HistorialComponent } from './componentes/historial/historial.component';
import { PagoComponent } from './componentes/pago/pago.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [authGuard]
  },
  {
    path: 'historial',
    component: HistorialComponent,
    canActivate: [authGuard]
  },
  {
    path: 'pago',
    component: PagoComponent,
    canActivate: [authGuard]
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
    path: 'home/:idCategoria', component: VerProductosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'home/buscarNombre/:nombreProducto', component: VerProductosComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'carrito-compras',
    component: CarritoComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
