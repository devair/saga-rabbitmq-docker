export interface IOrderQueueAdapterOUT {
 
    publish(message: string): Promise<void>
    
}