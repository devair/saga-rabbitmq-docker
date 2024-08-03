import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({name: "payment_id", type: "varchar"})
  paymentId: string | undefined;

  @Column({ type: "varchar"})
  status: string | undefined;
}
