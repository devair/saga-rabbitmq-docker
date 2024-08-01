import "reflect-metadata";
import express from "express";
import { AppDataSource } from "../infra/persistence/ormconfig";
import { Order } from "../domain/entity/Order";
import amqp from 'amqplib';
//import { PubSub } from "@google-cloud/pubsub";
import * as dotenv from 'dotenv'

import { orderRouters } from "../interface/routers/OrdersRoutes";

dotenv.config();

const app = express();
//const pubsub = new PubSub();

app.use(express.json());

const rabbitMqUrl = process.env.RABBITMQ_URL ? process.env.RABBITMQ_URL : '' ;

AppDataSource.initialize()
.then(async () => {

  const orderRoutes = await orderRouters ();
  app.use('/orders', orderRoutes);

  app.listen(3000, () => {
    console.log("Orders service listening on port 3000");
  });
}).catch((error: any) => console.log(error));
