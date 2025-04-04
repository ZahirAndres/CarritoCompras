import { NgModule } from '@angular/core';

import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrimengModule } from './primeng.module';
import { LoginComponent } from './componentes/login/login.component';
import { RegisterComponent } from './componentes/register/register.component';
import { HomeComponent } from './componentes/home/home.component';
import { HeaderComponent } from './componentes/header/header.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import {  HttpClientModule } from '@angular/common/http';
import { VerProductosComponent } from './componentes/productos/ver-productos/ver-productos.component';
import { CrearProductoComponent } from './componentes/productos/crear-producto/crear-producto.component';
import { DetalleProductoComponent } from './componentes/productos/detalle-producto/detalle-producto.component';
import { NavBarComponent } from './componentes/nav-bar/nav-bar.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { CommonModule } from '@angular/common';
import { HistorialComponent } from './componentes/historial/historial.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { PagoComponent } from './componentes/pago/pago.component';
import { CarritoComponent } from './componentes/compras/carrito/carrito.component';
import { PagoExitosoDialogComponent } from './componentes/pago-exitoso-dialog/pago-exitoso-dialog.component';
import { ChatComponent } from './componentes/chat/chat.component';
import { DialogService } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    VerProductosComponent,
    CrearProductoComponent,
    DetalleProductoComponent,
    NavBarComponent,
    PerfilComponent,
    HistorialComponent,
    CarritoComponent,
    PagoComponent,
    PagoExitosoDialogComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PrimengModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule
  ],
  providers: [
    MessageService,
    provideClientHydration(),
    provideAnimationsAsync(),
    DialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
