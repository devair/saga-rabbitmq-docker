import { Order } from "../../domain/entity/Order"
import { IOrderCreatedQueueAdapterOUT } from "../../domain/messaging/IOrderCreatedQueueAdapterOUT"
import { IOrderRepository } from "../../domain/repository/IOrderRepository"
import { ICreateOrderUseCase } from "../../domain/useCase/ICreateOrderUseCase"

import { AppDataSource } from "../../infra/persistence/ormconfig"


export class CreateOrderUserCase implements ICreateOrderUseCase{        
    constructor(
        private readonly repository: IOrderRepository,
        private publisher: IOrderCreatedQueueAdapterOUT
    ){}

    async execute(orderData: any): Promise<Order> {
        const queryRunner = AppDataSource.createQueryRunner()

        await queryRunner.startTransaction()
        
        try {
            
            const createdOrder = await this.repository.create(orderData)

            // Publicar evento de pedido criado
            await this.publisher.publish(JSON.stringify(createdOrder))

            // Confirma a transação
            await queryRunner.commitTransaction()            
            return createdOrder

        } catch (error) {           
            // Em caso de erro, faz o rollback da transação 
            await queryRunner.rollbackTransaction()            
            throw error
        }  
        finally{
            await queryRunner.release()    
        }   
    }
    
}