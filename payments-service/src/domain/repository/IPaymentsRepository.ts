import { Payment } from "../entity/Payment"

export interface IPaymentsRepository {

    create( payment: Payment): Promise<Payment>

    save( payment: Payment): Promise<Payment>

    findById(id: string): Promise<Payment | null>
}