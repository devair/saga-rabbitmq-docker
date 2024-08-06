export class Shipping {
  id?: string
  orderId: number
  status: string

  constructor(orderId: number) {
    this.orderId = orderId
    this.status = ""
  }

}