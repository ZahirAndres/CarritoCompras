import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerProductosComponent } from './components/productos/ver-productos/ver-productos.component';

const routes: Routes = [
  { path: '', component: VerProductosComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
