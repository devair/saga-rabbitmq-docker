import { Payment } from "../entity/Payment";

export interface ICreatePaymentUseCase {    
    execute(payment: Payment) : Promise<Payment>    
}