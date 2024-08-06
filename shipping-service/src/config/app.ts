import express from "express"
import * as dotenv from 'dotenv'
import amqplib from "amqplib";
import { AppDataSource } from "../infra/persistence/ormconfig"
import { TypeOrmShippingRepository } from "../infra/persistence/TypeOrmShippingRepository"
import { ShippingEntity } from "../infra/persistence/entity/ShippingEntity"
import { QueueNames } from "../domain/messaging/QueueNames"
import { CreateShippingUseCase } from "../application/useCase/CreateShippingUseCase"
import { ShippingQueueAdapterOUT } from "../infra/persistence/messaging/ShippingQueueAdapterOUT"
import { PaymentPendingQueueAdapterIN } from "../infra/persistence/messaging/PaymentPendingQueueAdapterIN"

dotenv.config()

const rabbitMqUrl = process.env.RABBITMQ_URL ? process.env.RABBITMQ_URL : '';


export const createApp = async () => {
    const app = express()
    app.use(express.json())

    // Configura Persistencia
    const dataSource = await AppDataSource.initialize()

    const shippingRepository = new TypeOrmShippingRepository(dataSource.getRepository(ShippingEntity))

    
    // Configura mensageria
    const rabbitMQConnection = await amqplib.connect(rabbitMqUrl);
    const shippingPendingPublisher = new ShippingQueueAdapterOUT(rabbitMQConnection, QueueNames.SHIPPING_PENDING)
    await shippingPendingPublisher.connect()

    //const paymentApprovedPublisher = new PaymentQueueAdapterOUT(rabbitMQConnection, QueueNames.PAYMENT_APPROVED)
    //await paymentApprovedPublisher.connect()

    // Configura caso de uso e interface
    const createShippingUseCase = new CreateShippingUseCase(shippingRepository, shippingPendingPublisher)
    // const createPaymentController = new CreatePaymentController(createPaymentUseCase)    
    // const approvedPaymentUserCase = new ApprovedPaymentUserCase(paymentsRepository, paymentApprovedPublisher)
    // const approvedPaymentController = new ApprovedPaymentController(approvedPaymentUserCase)

    // Configura consumidor de ordem criada
    const paymentCreatedConsumer = new PaymentPendingQueueAdapterIN(rabbitMqUrl,createShippingUseCase)
    await paymentCreatedConsumer.consume()   

    //app.use('/', paymentsRouters(createPaymentController, approvedPaymentController))


    app.listen(3002, () => {
        console.log("Payments service listening on port 3001");
    });
}