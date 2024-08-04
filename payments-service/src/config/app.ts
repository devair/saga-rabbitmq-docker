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
    const publisher = new PaymentQueueAdapterOUT(rabbitMQConnection, "paymentProcessed")
    await publisher.connect()

    // Configura caso de uso e interface
    const createPaymentUseCase = new CreatePaymentUserCase(paymentsRepository, publisher)
    const createPaymentController = new CreatePaymentController(createPaymentUseCase)

    // Configura consumidor
    const connection = rabbitMQConnection
    const channel = await connection.createChannel();
    const queue = 'orderCreated';

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const order = JSON.parse(msg.content.toString());
            console.log(order)
            const payment = createPaymentUseCase.execute({ orderId: order.id, status: "processed" })

            // Publique um evento de pagamento processado
            const paymentBuffer = Buffer.from(JSON.stringify(payment));
            channel.sendToQueue('paymentProcessed', paymentBuffer);

            channel.ack(msg);
        }
    })


    

    app.use('/', paymentsRouters(createPaymentController))

    app.listen(3001, () => {
        console.log("Payments service listening on port 3001");
    });
}