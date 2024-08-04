import amqpCallback from "amqplib/callback_api"
import { CreatePaymentUserCase } from "../../application/useCase/CreatePaymentUseCase";

export class OrderCreatedQueueAdapterIN {

    static QUEUE_NAME = 'orderCreated'

    constructor(
        private rabbitMQUrl: string,
        private createPaymentUseCase: CreatePaymentUserCase
    ) { }

    async consume() {
        amqpCallback.connect(this.rabbitMQUrl, (err: any, connection: any) => {
            if (err) {
                throw err;
            }

            connection.createChannel((err: any, channel: any) => {
                if (err) {
                    throw err;
                }

                channel.assertQueue(OrderCreatedQueueAdapterIN.QUEUE_NAME, { durable: true });

                channel.consume(OrderCreatedQueueAdapterIN.QUEUE_NAME, async (msg: any) => {
                    if (msg !== null) {
                        try {
                            // Processa a mensagem                            
                            const order = JSON.parse(msg.content.toString());
                            console.log('Received:', order)

                            // Aqui o servico persiste e publica na mesma transacao para o proximo canal
                            const payment = await this.createPaymentUseCase.execute({ orderId: order.id, status: "processed" })
                            channel.ack(msg);
                        } catch (error) {
                            console.error('Processing error');
                            // Rejeita a mensagem e reencaminha para a fila
                            channel.nack(msg);
                        }
                    }
                }, { noAck: false })
            })
        })
    }

}