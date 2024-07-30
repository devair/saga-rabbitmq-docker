import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({name: "payment_id", type: "numeric"})
  paymentId: number | undefined;

  @Column({ type: "varchar"})
  status: string | undefined;
}
