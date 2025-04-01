import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import { PagoExitosoDialogComponent } from '../pago-exitoso-dialog/pago-exitoso-dialog.component';

declare var paypal: any;

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent {
  idUsuario = sessionStorage.getItem("idUsuario") ? parseInt(sessionStorage.getItem("idUsuario")!) : 0;

  constructor(
    private paymentService: PaymentService, 
    private carritoService: CarritoService, 
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.paymentService.obtenerCarrito(this.idUsuario).subscribe((response) => {
      if (response && response.carritosPagados && response.carritosPagados.length > 0) {
        const carrito = response.carritosPagados[0];
        const total = carrito.total;

        paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return this.paymentService.crearOrden(total).toPromise().then(order => order?.id);
          },
          onApprove: (data: any, actions: any) => {
            return this.paymentService.capturarOrden(data.orderID).toPromise().then(() => {
              this.carritoService.updateEstado(carrito.idCarrito).subscribe(() => {
                // Mostrar modal de éxito
                const dialogRef = this.dialog.open(PagoExitosoDialogComponent, {
                  width: '400px'
                });

                dialogRef.afterClosed().subscribe(() => {
                  this.router.navigate(['/home']);
                });
              });
            });
          },
          onError: (err: any) => {
            console.error("Error en el proceso de PayPal", err);
          }
        }).render("#paypal-button-container");
      }
    });
  }
}
