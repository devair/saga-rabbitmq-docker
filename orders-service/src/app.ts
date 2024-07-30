import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./ormconfig";
import { Order } from "./entity/Order";
import amqp from 'amqplib';
//import { PubSub } from "@google-cloud/pubsub";

import * as dotenv from 'dotenv'

dotenv.config();

const app = express();
//const pubsub = new PubSub();

app.use(express.json());

const rabbitMqUrl = process.env.RABBITMQ_URL ? process.env.RABBITMQ_URL : '' ;

AppDataSource.initialize().then(async () => {

  const connection = await amqp.connect(rabbitMqUrl);
  const channel = await connection.createConfirmChannel();
  const queue = 'orderCreated';

  await channel.assertQueue(queue, { durable: false });

  app.post("/order", async (req, res) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const orderRepository = queryRunner.manager.getRepository(Order);
      const order = orderRepository.create(req.body);
      await orderRepository.save(order, { transaction: true });

      // Publique um evento de pedido criado no Google
      //const dataBuffer = Buffer.from(JSON.stringify(order));
      //await pubsub.topic("orderCreated").publishMessage({ data: dataBuffer });

      // Publique um evento de pedido criado no RabbitMQ
      const orderBuffer = Buffer.from(JSON.stringify(order));

      channel.sendToQueue(queue, orderBuffer, {}, async (err, ok) => {
        if (err) {
          await queryRunner.rollbackTransaction();
          await queryRunner.release()
          res.status(500).send("Failed to send message to RabbitMQ");
        } else {
          await queryRunner.commitTransaction();
          await queryRunner.release()
          res.status(201).send(order);
        }
      });
    }
    catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release()
      res.status(500).send("Failed to create order");
    }    
  });

  app.listen(3000, () => {
    console.log("Orders service listening on port 3000");
  });
}).catch(error => console.log(error));
