import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'text', // SQLite no tiene un tipo específico para imágenes, pero 'text' es suficiente para URLs
        nullable: true,
    })
    img!: string;

    @Column({
        type: 'varchar',
        length: 100,
    })
    name!: string;

    @Column({
        type: 'float', // SQLite utiliza 'REAL' para valores de punto flotante, pero TypeORM maneja esto automáticamente
    })
    price!: number;

    @Column({
        type: 'integer', // Aseguramos que se almacene como número entero
    })
    quantity!: number;

    constructor(img: string, name: string, price: number, quantity: number) {
        this.img = img;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
}
