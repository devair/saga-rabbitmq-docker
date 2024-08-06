
export class Payment {
  id?: string
  orderId: number
  status: string
  paymentDate: Date | undefined
  amount: number
  
  constructor(orderId: number, amount: number){
    this.orderId = orderId 
    this.status = PaymentStatus.PENDING
    this.amount = amount
  }

  received(paymentDate: Date) {
    this.paymentDate = paymentDate    
    this.status = PaymentStatus.APPROVED
  }

  rejected() {    
    this.status = PaymentStatus.REJECTED
  } 
}

export enum PaymentStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected"
}