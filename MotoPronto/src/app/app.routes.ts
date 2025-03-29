import { Routes } from '@angular/router';
import { VerProductosComponent } from './components/productos/ver-productos/ver-productos.component';

export const routes: Routes = [
    { path: '', component: VerProductosComponent, pathMatch: 'full' }
];
