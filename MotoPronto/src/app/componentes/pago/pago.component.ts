import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { CarritoService } from '../../services/carrito.service';
declare var paypal: any;

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent {
  idUsuario = sessionStorage.getItem("idUsuario") ? parseInt(sessionStorage.getItem("idUsuario")!) : 0;

  constructor(private paymentService: PaymentService, private carritoService : CarritoService) { }

  ngOnInit(): void {
    // Primero, obtenemos el carrito actual
    this.paymentService.obtenerCarrito(this.idUsuario).subscribe(
      (response) => {
        if (response && response.carritosPagados && response.carritosPagados.length > 0) {
          const carrito = response.carritosPagados[0];
          const total = carrito.total; // Asegúrate que 'total' tenga el formato adecuado, por ejemplo "10.00"

          // Renderizar el botón de PayPal con el total obtenido
          paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              return this.paymentService.crearOrden(total).toPromise()
                .then(order => order?.id);
            },
            onApprove: (data: any, actions: any) => {
              // Una vez aprobado, se captura el pago
              return this.paymentService.capturarOrden(data.orderID).toPromise()
                .then((captureResponse: any) => {
                  alert("Pago exitoso");
                  this.carritoService.updateEstado(carrito.idCarrito).subscribe(
                    (response) => {
                      console.log("Estado actualizado:", response);
                      alert("Estado del carrito actualizado a 'Pagado'.");
                    }
                  );
                });
            },
            onError: (err: any) => {
              console.error("Error en el proceso de PayPal", err);
              alert("Ocurrió un error en el pago.");
            }
          }).render("#paypal-button-container");
        } else {
          alert("No se encontró un carrito en proceso.");
        }
      },
      (error) => {
        console.error("Error al obtener el carrito:", error);
        alert("Error al obtener el carrito.");
      }
    );
  }
}
