import amqpCallback from "amqplib/callback_api"
import { CreatePaymentUserCase } from "../../application/useCase/CreatePaymentUseCase";
import { QueueNames } from "../../domain/messaging/QueueNames"
import { Payment, PaymentStatus } from "../../domain/entity/Payment"

export class OrderCreatedQueueAdapterIN {
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
                channel.assertQueue(QueueNames.ORDER_CREATED, { durable: true });
                channel.consume(QueueNames.ORDER_CREATED, async (msg: any) => {
                    if (msg !== null) {
                        try {
                            // Processa a mensagem                            
                            const order = JSON.parse(msg.content.toString());
                            console.log('Received:', order)

                            // Aqui o servico persiste e publica na mesma transacao para o proximo canal
                            await this.createPaymentUseCase.execute({ orderId: order.id, status: PaymentStatus.PENDING, amount: order.amount })
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