import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./ormconfig";
import { Shipping } from "./entity/Shipping";
import amqp from 'amqplib';

const app = express();
app.use(express.json());

const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';

AppDataSource.initialize().then(async () => {
  const connection = await amqp.connect(rabbitMqUrl);
  const channel = await connection.createChannel();
  const queue = 'paymentProcessed';

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const payment = JSON.parse(msg.content.toString());

      console.log(payment)

      const shippingRepository = AppDataSource.getRepository(Shipping);
      const shipping = shippingRepository.create({ paymentId: payment._id, status: "shipped", orderId: payment.orderId });
      await shippingRepository.save(shipping);

      channel.ack(msg);
    }
  });

  app.listen(3002, () => {
    console.log("Shipping service listening on port 3002");
  });
}).catch(error => console.log(error));
