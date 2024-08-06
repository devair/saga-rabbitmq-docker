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
    
    @Column({ nullable: false})
    amount: number 
    
    @Column({ nullable: true})
    paymentDate: Date | undefined

    constructor(){
        this._id = new ObjectId()    
        this.orderId = 0  
        this.status = ''  
        this.amount = 0         
    }
    toDomain(): Payment {
        let payment = new Payment(this.orderId, this.amount)
        payment.status = this.status
        payment.paymentDate = this.paymentDate
        payment.amount = this.amount
        payment.id = this._id.toString()
        payment.orderId = this.orderId        
        return payment
    }

    static fromDomain(payment: Payment): PaymentEntity {
        const paymentEntity = new PaymentEntity();
        
        if(payment.id){
            paymentEntity._id = new ObjectId(payment.id)
        }
        paymentEntity.orderId = payment.orderId      
        paymentEntity.amount = payment.amount
        paymentEntity.paymentDate = payment.paymentDate
        paymentEntity.status = payment.status

        return paymentEntity;
      }

}