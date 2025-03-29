import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CrearProductoComponent } from './components/productos/crear-producto/crear-producto.component';
import { VerProductosComponent } from './components/productos/ver-productos/ver-productos.component';
import { DetalleProductoComponent } from './components/productos/detalle-producto/detalle-producto.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    CrearProductoComponent,
    VerProductosComponent,
    DetalleProductoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
