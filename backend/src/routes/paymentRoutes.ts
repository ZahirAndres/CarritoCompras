import express from 'express';
import { PaymentController } from '../controllers/paymentController';

const router = express.Router();
const paymentController = new PaymentController();


router.post('/create-order', paymentController.crearOrden);

router.post('/capture-order', paymentController.capturarOrden);

export default router;
