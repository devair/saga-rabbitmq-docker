import { Router } from "express";
import { OrdersController } from "../controllers/OrdersController";

export const orderRouters = (ordersController: OrdersController) => {
    const router = Router();

    // Mapeamento da rota    
    router.post('/', (req, res) => ordersController.createOrder(req, res));

    return router
}