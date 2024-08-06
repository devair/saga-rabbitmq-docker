import { Payment, PaymentStatus } from "../../domain/entity/Payment";
import { IPaymentQueueAdapterOUT } from "../../domain/messaging/IPaymentQueueAdapterOUT";
import { IPaymentsRepository } from "../../domain/repository/IPaymentsRepository";
import { IApprovedPaymentUserCase } from "../../domain/useCase/IApprovedPaymentUserCase"
import { AppDataSource } from "../../infra/persistence/ormconfig";

export class ApprovedPaymentUserCase implements IApprovedPaymentUserCase {
    constructor(
        private readonly repository: IPaymentsRepository,
        private publisher: IPaymentQueueAdapterOUT
    ) { }

    async execute(id: string, paymentDate: Date): Promise<Payment> {
        const queryRunner = AppDataSource.createQueryRunner()

        await queryRunner.startTransaction()
        try {
            const paymentFound = await this.repository.findById(id)
            if(!paymentFound) throw new Error(`Payment id ${id} not found`)

            switch (paymentFound.status){
                case PaymentStatus.APPROVED: {
                    throw new Error(`Payment id ${id} already approved`)                    
                }
                case PaymentStatus.REJECTED: {
                    throw new Error(`Payment id ${id} already rejected`)                    
                }
            }
                        
            paymentFound.received(paymentDate)

            const paymentUpdated = await this.repository.save(paymentFound)
                
            // Publicar evento de pagamento recebido
            await this.publisher.publish(JSON.stringify(paymentUpdated))

            // Confirma a transação
            await queryRunner.commitTransaction()

            return paymentUpdated

        } catch (error) {
            // Em caso de erro, faz o rollback da transação 
            await queryRunner.rollbackTransaction()
            throw error
        }
        finally {
            await queryRunner.release()
        }
    }
}
