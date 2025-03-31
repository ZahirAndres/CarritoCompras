import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { Carrito } from '../../models/carrito';
import { CarritoService } from '../../services/carrito.service';


@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent {
  carritosPagados: Carrito[] = [];
  idUsuario = sessionStorage.getItem('idUsuario') || '';
  constructor(private carritoService : CarritoService) {}

  ngOnInit() {
    this.obtenerCarritosPagados();
  }

  obtenerCarritosPagados() {
    this.carritoService.obtenerCarritosPagados(this.idUsuario).subscribe(response => {
      if (response.code === 200) {
        this.carritosPagados = response.carritosPagados;
      }
    });
  }
}
