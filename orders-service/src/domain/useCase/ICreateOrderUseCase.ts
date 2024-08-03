import { Order } from "../entity/Order";

export interface ICreateOrderUseCase {
    
    execute(order: Order) : Promise<Order>
    
}