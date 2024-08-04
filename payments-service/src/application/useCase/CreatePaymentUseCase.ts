import { Payment } from "../../domain/entity/Payment";
import { IPaymentQueueAdapterOUT } from "../../domain/messaging/IPaymentQueueAdapterOUT";
import { IPaymentsRepository } from "../../domain/repository/IPaymentsRepository";
import { ICreatePaymentUseCase } from "../../domain/useCase/ICreateOrderUseCase";
import { AppDataSource } from "../../infra/persistence/ormconfig";

export class CreatePaymentUserCase implements ICreatePaymentUseCase {
    constructor(
        private readonly repository: IPaymentsRepository,
        private publisher: IPaymentQueueAdapterOUT
    ) { }

    async execute(paymentData: any): Promise<Payment> {
        const queryRunner = AppDataSource.createQueryRunner()

        await queryRunner.startTransaction()
        try {
            const createdPayment = this.repository.create(paymentData)

            // Publicar evento de pagamento criado
            await this.publisher.publish(JSON.stringify(createdPayment))

            // Confirma a transação
            await queryRunner.commitTransaction()
            return createdPayment

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
