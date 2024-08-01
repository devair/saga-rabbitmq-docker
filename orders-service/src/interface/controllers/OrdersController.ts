import { Request, Response } from "express";
import { ICreateOrderUseCase } from "../../domain/useCase/ICreateOrderUseCase"
import { UsingJoinColumnOnlyOnOneSideAllowedError } from "typeorm";

export class OrdersController {

    constructor(
        private createOrderUseCase: ICreateOrderUseCase

    ) { }

    async createOrder(req: Request, res: Response): Promise<Response> {

        try {
            const order = await this.createOrderUseCase.execute(req.body);
            return res.status(201).json(order);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Failed to create order" });
        }
    }
}