import amqplib from "amqplib";
import { IOrderCreatedQueueAdapterOUT } from "../../../domain/messaging/IOrderCreatedQueueAdapterOUT";

export class  OrderQueueAdapterOUT implements IOrderCreatedQueueAdapterOUT{
    
    private channel!: amqplib.ConfirmChannel;

    constructor(
        private connection: amqplib.Connection,
        private queueName: string
    ) { }

    async connect() {
        this.channel = await this.connection.createConfirmChannel();
        await this.channel.assertQueue(this.queueName, { durable: true });
    }

    async publish(message: string): Promise<void>{
        const messageBuffer = Buffer.from(message);

        return new Promise((resolve, reject) => {
            this.channel.sendToQueue(this.queueName, messageBuffer, {}, (err, ok) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }

    async publish2(queueName: string, objectMessage: any): Promise<void> {

        const messageBuffer = Buffer.from(JSON.stringify(objectMessage));

        return new Promise((resolve, reject) => {
            this.channel.sendToQueue(queueName, messageBuffer, {}, (err, ok) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }
}
