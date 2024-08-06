import { Shipping } from "../entity/Shipping"

export interface ICreateShippingUseCase {
    
    execute(orderId: number, amount: number): Promise<Shipping>
}