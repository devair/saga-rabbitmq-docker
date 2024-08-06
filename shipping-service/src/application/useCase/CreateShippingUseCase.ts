import { Shipping } from "../../domain/entity/Shipping"
import { IShippingQueueAdapterOUT } from "../../domain/messaging/IShippingQueueAdapterOUT"
import { IShippingRepository } from "../../domain/repository/IShippingRepository"
import { ICreateShippingUseCase } from "../../domain/useCase/ICreateShippingUseCase"
import { AppDataSource } from "../../infra/persistence/ormconfig"

export class CreateShippingUseCase implements ICreateShippingUseCase{

    constructor(
        private repository: IShippingRepository,
        private publisher: IShippingQueueAdapterOUT
    ){}

    async execute(orderId: number): Promise<Shipping> {
        const queryRunner = AppDataSource.createQueryRunner()

        await queryRunner.startTransaction()
        try {
            const shipping = new Shipping(orderId)

            const createShipping = await this.repository.create(shipping)

            // Publicar evento de shipping criado
            await this.publisher.publish(JSON.stringify(createShipping))

            // Confirma a transação
            await queryRunner.commitTransaction()
            return createShipping

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