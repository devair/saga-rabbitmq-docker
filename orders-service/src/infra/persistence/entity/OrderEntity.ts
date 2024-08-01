import { EntitySchema } from "typeorm";
import { Order } from "../../../domain/entity/Order";


export const OrderEntity = new EntitySchema<Order>({
    name: 'orders',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        }, 
        item: {
            type: "varchar"
        },
        quantity: {
            type: "numeric"
        }
    }
})