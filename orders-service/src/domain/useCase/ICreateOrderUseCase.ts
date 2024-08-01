import { Order } from "../entity/Order";

export interface ICreateOrderUseCase {
    
    execute(order: any) : Promise<Order>
    getCreateOrderPublisher(): any 
}