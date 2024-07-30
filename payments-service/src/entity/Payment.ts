import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({name: "order_id", type: "numeric"})
  orderId: number | undefined;

  @Column({ type: "varchar"})
  status: string | undefined;
}
