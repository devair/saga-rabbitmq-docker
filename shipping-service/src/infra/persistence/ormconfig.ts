import { DataSource } from "typeorm";
import * as dotenv from 'dotenv'

dotenv.config();

const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.MONGO_URI,      
  synchronize: true,
  logging: true,    
  entities: ['**/persistence/entity/*.ts'],
})

export { AppDataSource } 