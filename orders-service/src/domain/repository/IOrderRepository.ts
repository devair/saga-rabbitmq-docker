import { Order } from "../entity/Order";

export interface IOrderRepository {
    
    create( order: Order): Promise<Order>

    findById(id: string): Promise<Order | null>
}