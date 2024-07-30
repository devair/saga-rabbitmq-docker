import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./ormconfig";
import { Payment } from "./entity/Payment";
import amqp from 'amqplib';

const app = express();
app.use(express.json());

const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';

AppDataSource.initialize().then(async () => {
  const connection = await amqp.connect(rabbitMqUrl);
  const channel = await connection.createChannel();
  const queue = 'orderCreated';

  await channel.assertQueue(queue, { durable: false });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const order = JSON.parse(msg.content.toString());

      const paymentRepository = AppDataSource.getRepository(Payment);
      const payment = paymentRepository.create({ orderId: order.id, status: "processed" });
      await paymentRepository.save(payment);

      // Publique um evento de pagamento processado
      const paymentBuffer = Buffer.from(JSON.stringify(payment));
      channel.sendToQueue('paymentProcessed', paymentBuffer);

      channel.ack(msg);
    }
  });

  app.listen(3001, () => {
    console.log("Payments service listening on port 3001");
  });
}).catch(error => console.log(error));
