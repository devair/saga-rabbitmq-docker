import { Payment } from "../entity/Payment";

export interface IApprovedPaymentUserCase {    
    execute(id: string, paymentDate: Date) : Promise<Payment>    
}