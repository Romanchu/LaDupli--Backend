import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    img: string

    @Column({
        length: 100,
    })
    name!: string

    @Column()
    price!: number

    @Column()
    quantity!: number

    constructor(img: string, name: string, price: number, quantity: number) {
        this.img = img;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

}