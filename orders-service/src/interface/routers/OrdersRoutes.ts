import { Router } from "express";
import { OrdersController } from "../controllers/OrdersController";
import { CreateOrderUserCase } from "../../application/useCase/CreateOrderUseCase";
import { TypeOrmOrdersRepository } from "../../infra/persistence/repository/TypeOrmOrdersRepository";
import { AppDataSource } from "../../infra/persistence/ormconfig";
import { OrderEntity } from "../../infra/persistence/entity/OrderEntity";
import { RabbitMQCreateOrderPublisher } from "../../infra/messaging/rabbitmq/RabbitMQCreateOrderPublisher";

import amqp from 'amqplib';

export const orderRouters = async (): Promise<Router> => {

    const router = Router();

    // Canal do RabbitMQ
    const rabbitMqUrl = process.env.RABBITMQ_URL ? process.env.RABBITMQ_URL : '';
    const connection = await amqp.connect(rabbitMqUrl);
    const channel = await connection.createConfirmChannel();
    const queue = 'orderCreated';
    await channel.assertQueue(queue, { durable: false });

    // Repositorio 
    const repository = new TypeOrmOrdersRepository(AppDataSource.getRepository(OrderEntity))
    
    // Canal de publicacao
    const createOrderPublisher = new RabbitMQCreateOrderPublisher(channel);

    // Caso de uso 
    const createOrderUseCase = new CreateOrderUserCase(repository, createOrderPublisher)
    
    // Request Handler
    const ordersController = new OrdersController(createOrderUseCase)

    // Mapeamento da rota    
    router.post('/', (req, res) => ordersController.createOrder(req, res));

    return router
}