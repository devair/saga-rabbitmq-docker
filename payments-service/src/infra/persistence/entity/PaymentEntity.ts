import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Payment } from '../../../domain/entity/Payment';

@Entity({ name: 'payments'})
export class PaymentEntity {
    @ObjectIdColumn({ name: '_id'})
    _id: ObjectId

    @Column({ nullable: false})
    orderId: number 

    @Column({ nullable: false})
    status: string

    constructor(){
        this._id = new ObjectId()    
        this.orderId = 0  
        this.status = ''  
    }
    toDomain(): Payment {
        let payment = new Payment(this.orderId, this.status)
        payment.id = this._id.toString()
        return payment
    }

    static fromDomain(payment: Payment): PaymentEntity {
        const paymentEntity = new PaymentEntity();
        
        if(payment.id){
            paymentEntity._id = new ObjectId(payment.id)
        }
        paymentEntity.orderId = payment.orderId      
        return paymentEntity;
      }

}