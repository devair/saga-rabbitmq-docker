export enum QueueNames {
    ORDER_CREATED = "orderCreated",
    PAYMENT_PENDING = "paymentPending",
    PAYMENT_APPROVED = "paymentApproved",
    PAYMENT_REJECTED = "paymentReject"
}

/*
queue1:
    name: pedidos
queue2:
    name: pagamentos_pendentes
queue3:
    name: pagamentos_confirmados
queue4:
    name: entregas_confirmadas
*/    