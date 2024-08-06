import { Request, Response } from "express";
import { Payment } from "../../../domain/entity/Payment"
import { IApprovedPaymentUserCase } from "../../../domain/useCase/IApprovedPaymentUserCase"

export class ApprovedPaymentController {

    constructor(private approvedPaymentUserCase: IApprovedPaymentUserCase) { }

    async handler(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params
            const { paymentDate } = req.body
            const order = await this.approvedPaymentUserCase.execute(id, paymentDate)
            return res.status(201).json(order);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Failed to approve payment" });
        }
    }
}