import { Request, Response } from 'express';
import * as paypal from '@paypal/checkout-server-sdk';
import { client } from '../config/paypalConfig';

export class PaymentController {
  public async crearOrden(req: Request, res: Response): Promise<void> {
    const { amount } = req.body; // Asegúrate de que 'amount' sea un número o cadena válida

    // Validar que el monto sea mayor a 0
    const monto = parseFloat(amount);
    if (isNaN(monto) || monto <= 0) {
      return res.status(400).json({ message: 'El monto debe ser mayor a 0' });
    }

    const montoFormateado = monto.toFixed(2); // Formatea a dos decimales

    try {
      const request = new paypal.orders.OrdersCreateRequest();
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD', // O la moneda que uses, ej. 'MXN'
              value: montoFormateado
            }
          }
        ],
        application_context: {
          brand_name: 'MontoPronto',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: 'http://localhost:4200/historial',
          cancel_url: 'http://localhost:4200/pago'
        }
      });

      const order = await client().execute(request);
      const orderID = order.result.id;
      res.json({ id: orderID });
    } catch (error: any) {
      console.error('Error al crear la orden:', error);
      res.status(500).json({ message: 'Error al crear la orden de PayPal', details: error.message || error.toString() });
    }
  }

  public async capturarOrden(req: Request, res: Response): Promise<void> {
    const { orderID } = req.body;
    try {
      const request = new paypal.orders.OrdersCaptureRequest(orderID);
      request.requestBody({});
      const capture = await client().execute(request);
      if (capture.result.status === 'COMPLETED') {
        res.json({ message: 'Pago completado con éxito' });
      } else {
        res.status(400).json({ message: 'Pago no completado' });
      }
    } catch (error: any) {
      console.error('Error al capturar la orden:', error);
      res.status(500).json({ message: 'Error al capturar la orden de PayPal', details: error.message || error.toString() });
    }
  }
}
