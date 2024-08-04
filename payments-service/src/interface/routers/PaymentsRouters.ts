import { Router } from "express"
import { CreatePaymentController } from "../controllers/payments/CreatePaymentController"

export const paymentsRouters = (createPaymentController: CreatePaymentController) =>{
    const router = Router()

    router.post('/', (req, res) => createPaymentController.handler(req,res) )

    return router
}