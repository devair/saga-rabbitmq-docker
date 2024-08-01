export interface ICreateOrderPublisher {
 
    publish(order: any): Promise<void>
    
}