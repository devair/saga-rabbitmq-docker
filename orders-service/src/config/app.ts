import express from "express"
import { OrdersController } from "../interface/controllers/OrdersController";
import { orderRouters } from "../interface/routers/OrdersRoutes";
import { TypeOrmOrdersRepository } from "../infra/persistence/repository/TypeOrmOrdersRepository";
import { AppDataSource } from "../infra/persistence/ormconfig";
import { OrderEntity } from "../infra/persistence/entity/OrderEntity";
import { RabbitMQPublisher } from "../infra/messaging/rabbitmq/RabbitMQPublisher";
import * as dotenv from 'dotenv'
import amqplib from "amqplib";
import { CreateOrderUserCase } from "../application/useCase/CreateOrderUseCase";

dotenv.config()

const rabbitMqUrl = process.env.RABBITMQ_URL ? process.env.RABBITMQ_URL : '';

export const createApp = async () => {
    const app = express()
    app.use(express.json())

    // Configura Persistencia
    const dataSource = await AppDataSource.initialize()
    const orderRepository = new TypeOrmOrdersRepository(dataSource.getRepository(OrderEntity))

    // Configura mensageria
    const rabbitMQConnection = await amqplib.connect(rabbitMqUrl);
    const publisher = new RabbitMQPublisher(rabbitMQConnection)
    await publisher.connect("orderCreated")

    // Configura caso de uso e interface
    const createOrderUseCase = new CreateOrderUserCase(orderRepository, publisher)
    const orderController = new OrdersController(createOrderUseCase)

    app.use('/orders', orderRouters(orderController))

    app.listen(3000, () => {
        console.log("Orders service listening on port 3000");
    });

    return app
}