import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    json: string

    constructor(json: string) {
        this.json = json;
    }
}

