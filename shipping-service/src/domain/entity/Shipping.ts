export class Shipping {
  id?: string
  orderId: number
  status: string

  constructor(orderId: number) {
    this.orderId = orderId
    this.status = ShippingStatus.PENDING
  }

}

export enum ShippingStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected"
}