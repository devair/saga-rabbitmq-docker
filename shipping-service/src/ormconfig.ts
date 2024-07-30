import { DataSource } from "typeorm";
import { Shipping } from "./entity/Shipping";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432, 
  username: process.env.POSTGRES_USER || "user",
  password: process.env.POSTGRES_PASSWORD || "password",
  database: process.env.POSTGRES_DB || "shipping",
  synchronize: true,
  logging: false,
  entities: [Shipping],
  migrations: [],
  subscribers: [],
});