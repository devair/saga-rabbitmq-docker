import { DataSource } from "typeorm";
import { Order } from "./entity/Order";
import * as dotenv from 'dotenv'

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT), 
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: [Order],
  migrations: [],
  subscribers: [],
});
