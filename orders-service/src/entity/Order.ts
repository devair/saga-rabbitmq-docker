import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()

export class Order {
    @PrimaryGeneratedColumn()
    id: number | undefined;
  
    @Column({ name: "item", type: "varchar"})
    item: string | undefined;
  
    @Column({ type: "numeric"})
    quantity: number | undefined;
}
