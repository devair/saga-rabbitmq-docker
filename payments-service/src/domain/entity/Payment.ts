
export class Payment {
  id: string | undefined
  orderId: number
  status: string

  constructor(orderId: number, status: string){
    this.orderId = orderId 
    this.status = status
  }
}
