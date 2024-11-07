import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'varchar',
        unique: true,
        length: 50, // Limita la longitud del nombre de usuario
    })
    username!: string;

    @Column({
        type: 'varchar',
        unique: true,
        length: 100, // Limita la longitud del correo electrónico
    })
    email!: string;

    @Column({
        type: 'text', // Para almacenar contraseñas encriptadas
    })
    password!: string;

    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
