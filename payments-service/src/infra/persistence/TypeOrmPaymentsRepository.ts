import { Repository } from "typeorm"
import { Payment } from "../../domain/entity/Payment"
import { IPaymentsRepository } from "../../domain/repository/IPaymentsRepository"
import { PaymentEntity } from "./entity/PaymentEntity"
import { ObjectId } from 'mongodb'

export class TypeOrmPaymentsRepository implements IPaymentsRepository {

    constructor(
        private readonly repository: Repository<PaymentEntity>
    ) { }

    async create(payment: Payment): Promise<Payment> {
        return (await this.repository.save(PaymentEntity.fromDomain(payment))).toDomain()        
    }

    async findById(id: string): Promise<Payment | null> {
        const payment = await this.repository.findOne({ where: { _id: new ObjectId(id) }}) 
        if(payment)
            return payment.toDomain()
        return null     
    }

    async save(payment: Payment): Promise<Payment> {
        return  (await this.repository.save(PaymentEntity.fromDomain(payment))).toDomain()     
    }
}