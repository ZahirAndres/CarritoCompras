import { Component, Inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Carrito } from '../../models/carrito';
import { CarritoService } from '../../services/carrito.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';


export function getSpanishPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Registros por página:';
  paginatorIntl.nextPageLabel = 'Siguiente';
  paginatorIntl.previousPageLabel = 'Anterior';
  paginatorIntl.firstPageLabel = 'Primera página';
  paginatorIntl.lastPageLabel = 'Última página';
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
  return paginatorIntl;
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
  ],
})
export class HistorialComponent implements OnInit, AfterViewInit, OnDestroy {
  // Arreglo para los carritos pagados
  carritosPagados: Carrito[] = [];
  // Obtenemos el idUsuario de sessionStorage, de forma segura
  idUsuario = (typeof window !== 'undefined' && sessionStorage.getItem('idUsuario')) || '';
  
  // MatTableDataSource para la tabla de Material
  dataSource = new MatTableDataSource<Carrito>([]);
  // Definimos las columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['idCarrito', 'estatus', 'fechaPago', 'fechaCreacion',  'subTotal' ,'total'];
  
  subscription!: Subscription;

  // Referencia al MatPaginator en el template
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private carritoService: CarritoService, @Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit() {
    this.obtenerCarritosPagados();
  }

  obtenerCarritosPagados() {
    this.subscription = this.carritoService.obtenerCarritosPagados(this.idUsuario).subscribe(response => {
      if (response.code === 200) {
        this.carritosPagados = response.carritosPagados;
        this.dataSource.data = this.carritosPagados;
      }
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
