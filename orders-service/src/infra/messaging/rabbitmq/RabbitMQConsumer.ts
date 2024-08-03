import amqplib from "amqplib";

export class RabbitMQConsumer {
    private channel!: amqplib.ConfirmChannel;

    constructor(private connection: amqplib.Connection) { }

    async connect(queueName: string) {
        this.channel = await this.connection.createConfirmChannel();
        await this.channel.assertQueue(queueName, { durable: true });
    }

    async consume(queueName: string, onMessage: (msg: any) => void) {
        this.channel.consume(queueName, (msg) => {
            if (msg !== null) {
                onMessage(JSON.parse(msg.content.toString()));
                this.channel.ack(msg);
            }
        });
    }
}
