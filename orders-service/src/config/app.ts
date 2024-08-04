import express from "express"
import * as dotenv from 'dotenv'
import amqplib from "amqplib";
import { OrdersController } from "../interface/controllers/OrdersController";
import { orderRouters } from "../interface/routers/OrdersRoutes";
import { TypeOrmOrdersRepository } from "../infra/persistence/repository/TypeOrmOrdersRepository";
import { AppDataSource } from "../infra/persistence/ormconfig";
import { OrderEntity } from "../infra/persistence/entity/OrderEntity";
import { CreateOrderUserCase } from "../application/useCase/CreateOrderUseCase";
import { OrderQueueAdapterOUT } from "../infra/messaging/rabbitmq/OrderQueueAdapterOUT";

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
    const publisher = new OrderQueueAdapterOUT(rabbitMQConnection, "orderCreated")
    await publisher.connect()

    // Configura caso de uso e interface
    const createOrderUseCase = new CreateOrderUserCase(orderRepository, publisher)
    const orderController = new OrdersController(createOrderUseCase)

    app.use('/', orderRouters(orderController))

    app.listen(3000, () => {
        console.log("Orders service listening on port 3000");
    });

    return app
}