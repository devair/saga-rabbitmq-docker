export interface IOrderCreatedQueueAdapterOUT {
 
    publish(message: string): Promise<void>
    
}