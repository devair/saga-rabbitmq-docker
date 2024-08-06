import amqpCallback from "amqplib/callback_api"
import { ICreateShippingUseCase } from "../../../domain/useCase/ICreateShippingUseCase"
import { QueueNames } from "../../../domain/messaging/QueueNames"


export class PaymentPendingQueueAdapterIN {
    constructor(
        private rabbitMQUrl: string,
        private createShippingUseCase: ICreateShippingUseCase
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
                channel.assertQueue(QueueNames.PAYMENT_PENDING, { durable: true });
                channel.consume(QueueNames.PAYMENT_PENDING, async (msg: any) => {
                    if (msg !== null) {
                        try {
                            // Processa a mensagem                            
                            const order = JSON.parse(msg.content.toString());
                            console.log('Shipping - Received:', order)

                            // Aqui o servico persiste e publica na mesma transacao para o proximo canal
                            await this.createShippingUseCase.execute(order.orderId, order.amount)
                            channel.ack(msg);
                        } catch (error) {
                            console.error('Processing error', error);
                            // Rejeita a mensagem e reencaminha para a fila
                            channel.nack(msg);
                        }
                    }
                }, { noAck: false })
            })
        })
    }

}