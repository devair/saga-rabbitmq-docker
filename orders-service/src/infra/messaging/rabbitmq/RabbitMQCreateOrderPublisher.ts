
import amqp from 'amqplib'
import { ICreateOrderPublisher } from '../../../domain/ports/ICreateOrderPublisher';

export class RabbitMQCreateOrderPublisher implements ICreateOrderPublisher {

    constructor(
        private readonly channel: amqp.ConfirmChannel
    ) { }

    async publish(order: any): Promise<void> {

        // Publica um evento de pedido criado no RabbitMQ
        const orderBuffer = Buffer.from(JSON.stringify(order));

        return new Promise((resolve, reject) => {
            this.channel.sendToQueue('orderCreated', orderBuffer, {}, (err, ok) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })

    }

}