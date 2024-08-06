import { Request, Response } from "express";
import { ICreatePaymentUseCase } from "../../../domain/useCase/ICreatePaymentUseCase";
import { Payment } from "../../../domain/entity/Payment"

export class CreatePaymentController {

    constructor(private createPaymentUseCase: ICreatePaymentUseCase) { }

    async handler(req: Request, res: Response): Promise<Response> {
        try {
            const { orderId, amount } = req.body
            const order = await this.createPaymentUseCase.execute( new Payment(orderId, amount) );
            return res.status(201).json(order);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Failed to create payment" });
        }
    }
}