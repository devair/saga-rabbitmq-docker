import amqplib from "amqplib";

export class RabbitMQPublisher {
    private channel!: amqplib.ConfirmChannel;

    constructor(private connection: amqplib.Connection) { }

    async connect(queueName: string) {
        this.channel = await this.connection.createConfirmChannel();
        await this.channel.assertQueue(queueName, { durable: true });
    }

    async publish(queueName: string, objectMessage: any): Promise<void> {

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
