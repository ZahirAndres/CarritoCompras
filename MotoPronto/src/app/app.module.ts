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
    PerfilComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PrimengModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    MessageService,
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
