
export class Payment {
  id?: string
  orderId: number
  status: string

  constructor(orderId: number, status: string){
    this.orderId = orderId 
    this.status = status
  }
}
