import { Repository } from "typeorm";
import { Order } from "../../../domain/entity/Order";
import { IOrderRepository } from "../../../domain/repository/IOrderRepository";

export class TypeOrmOrdersRepository implements IOrderRepository {
    
    constructor(
        private readonly repository: Repository<Order>
    ){}
    
    async create(order: Order): Promise<Order> {
        const orderEntity = this.repository.create(order)
        return  await this.repository.save(orderEntity)        
    }


    async findById(id: string): Promise<Order | null> {
        throw new Error("Method not implemented.");
    }
}