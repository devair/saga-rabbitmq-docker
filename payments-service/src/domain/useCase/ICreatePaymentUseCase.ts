import { Payment } from "../entity/Payment";

export interface ICreatePaymentUseCase {    
    execute(orderId: number, amount: number) : Promise<Payment>    
}