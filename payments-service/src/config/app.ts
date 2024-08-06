import express from "express"
import * as dotenv from 'dotenv'
import amqplib from "amqplib";
import { TypeOrmPaymentsRepository } from "../infra/persistence/TypeOrmPaymentsRepository";
import { PaymentQueueAdapterOUT } from "../infra/messaging/PaymentQueueAdapterOUT";
import { CreatePaymentUserCase } from "../application/useCase/CreatePaymentUseCase";
import { CreatePaymentController } from "../interface/controllers/payments/CreatePaymentController";
import { AppDataSource } from "../infra/persistence/ormconfig";
import { PaymentEntity } from "../infra/persistence/entity/PaymentEntity";
import { paymentsRouters } from "../interface/routers/PaymentsRouters";
import { OrderCreatedQueueAdapterIN } from  "../infra/messaging/OrderCreatedQueueAdapterIN"
import { QueueNames } from "../domain/messaging/QueueNames"
import { ApprovedPaymentUserCase } from "../application/useCase/ApprovedPaymentUserCase"
import { ApprovedPaymentController } from "../interface/controllers/payments/ApprovedPaymentController"


dotenv.config()

const rabbitMqUrl = process.env.RABBITMQ_URL ? process.env.RABBITMQ_URL : '';


export const createApp = async () => {
    const app = express()
    app.use(express.json())

    // Configura Persistencia
    const dataSource = await AppDataSource.initialize()

    const paymentsRepository = new TypeOrmPaymentsRepository(dataSource.getRepository(PaymentEntity))

    // Configura mensageria
    const rabbitMQConnection = await amqplib.connect(rabbitMqUrl);
    const paymentPendingPublisher = new PaymentQueueAdapterOUT(rabbitMQConnection, QueueNames.PAYMENT_PENDING)
    await paymentPendingPublisher.connect()

    const paymentApprovedPublisher = new PaymentQueueAdapterOUT(rabbitMQConnection, QueueNames.PAYMENT_APPROVED)
    await paymentApprovedPublisher.connect()

    // Configura caso de uso e interface
    const createPaymentUseCase = new CreatePaymentUserCase(paymentsRepository, paymentPendingPublisher)
    const createPaymentController = new CreatePaymentController(createPaymentUseCase)    
    const approvedPaymentUserCase = new ApprovedPaymentUserCase(paymentsRepository, paymentApprovedPublisher)
    const approvedPaymentController = new ApprovedPaymentController(approvedPaymentUserCase)

    // Configura consumidor de ordem criada
    const orderCreatedConsumer = new OrderCreatedQueueAdapterIN(rabbitMqUrl, createPaymentUseCase)
    await orderCreatedConsumer.consume()   

    app.use('/', paymentsRouters(createPaymentController, approvedPaymentController))


    app.listen(3001, () => {
        console.log("Payments service listening on port 3001");
    });
}