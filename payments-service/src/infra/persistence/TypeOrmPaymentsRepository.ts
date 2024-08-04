import { Repository } from "typeorm";
import { Payment } from "../../domain/entity/Payment";
import { IPaymentsRepository } from "../../domain/repository/IPaymentsRepository";
import { PaymentEntity } from "./entity/PaymentEntity";

export class TypeOrmPaymentsRepository implements IPaymentsRepository{
    
    constructor(
        private readonly repository: Repository<PaymentEntity>
    ){}
    
    async create(order: Payment): Promise<Payment> {
        const orderEntity = this.repository.create(order)
        return  await this.repository.save(orderEntity)        
    }

    async findById(id: string): Promise<Payment | null> {
        throw new Error("Method not implemented.");
    }
}