import { Router } from "express"
import { CreatePaymentController } from "../controllers/payments/CreatePaymentController"
import { ApprovedPaymentController } from "../controllers/payments/ApprovedPaymentController"

export const paymentsRouters = (createPaymentController: CreatePaymentController,
    approvedPaymentController: ApprovedPaymentController) => {

    const router = Router()

    router.post('/', (req, res) => createPaymentController.handler(req, res))

    router.patch('/approve/:id', (req, res) => approvedPaymentController.handler(req, res))

    return router
}