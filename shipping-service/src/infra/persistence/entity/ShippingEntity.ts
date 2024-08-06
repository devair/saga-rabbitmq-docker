import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { ObjectId } from 'mongodb'
import { Shipping } from '../../../domain/entity/Shipping'

@Entity({ name: 'shippings' })
export class ShippingEntity {
    @ObjectIdColumn({ name: '_id' })
    _id: ObjectId

    @Column({ nullable: false })
    orderId: number

    @Column({ nullable: false })
    status: string


    constructor() {
        this._id = new ObjectId()
        this.orderId = 0
        this.status = ''
    }
    toDomain(): Shipping {
        let payment = new Shipping(this.orderId)
        payment.status = this.status
        payment.id = this._id.toString()
        return payment
    }

    static fromDomain(payment: Shipping): ShippingEntity {
        const paymentEntity = new ShippingEntity()

        if (payment.id) {
            paymentEntity._id = new ObjectId(payment.id)
        }
        paymentEntity.orderId = payment.orderId
        paymentEntity.status = payment.status
        return paymentEntity
    }
}