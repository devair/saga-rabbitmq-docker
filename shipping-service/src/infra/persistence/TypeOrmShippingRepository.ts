import { Repository } from "typeorm"
import { ObjectId } from 'mongodb'
import { Shipping } from "../../domain/entity/Shipping"
import { ShippingEntity } from "./entity/ShippingEntity"
import { IShippingRepository } from "../../domain/repository/IShippingRepository"

export class TypeOrmShippingRepository implements IShippingRepository {

    constructor(
        private readonly repository: Repository<ShippingEntity>
    ) { }

    async create(shipping: Shipping): Promise<Shipping> {
        return (await this.repository.save(ShippingEntity.fromDomain(shipping))).toDomain()        
    }

    async findById(id: string): Promise<Shipping | null> {
        const shipping = await this.repository.findOne({ where: { _id: new ObjectId(id) }}) 
        if(shipping)
            return shipping.toDomain()
        return null     
    }

    async save(shipping: Shipping): Promise<Shipping> {
        return  (await this.repository.save(ShippingEntity.fromDomain(shipping))).toDomain()     
    }
}