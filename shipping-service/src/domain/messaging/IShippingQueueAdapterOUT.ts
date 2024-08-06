export interface IShippingQueueAdapterOUT {
    publish(message: string): Promise<void>
}