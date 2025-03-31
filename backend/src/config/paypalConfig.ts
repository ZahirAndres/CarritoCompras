import * as paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config(); // Para cargar variables de entorno desde .env

// Configuración del entorno (usar Sandbox en desarrollo)
function environment() {
  return new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID!,  // Tu Client ID
    process.env.PAYPAL_CLIENT_SECRET! // Tu Client Secret
  );
}

// Crear el cliente de PayPal
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

export { client };
