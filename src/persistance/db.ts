import { DataSource } from 'typeorm';
import { Product } from './product';
import { User } from './user';
import 'dotenv/config';

export const AppDataSource = new DataSource({
    type: 'sqlite', // Cambiamos de 'mysql' a 'sqlite'
    database: './database.sqlite', // Archivo de la base de datos SQLite
    synchronize: true, // Sincroniza automáticamente la estructura de la base de datos
    dropSchema: false, // Evita que se elimine el esquema en cada inicio
    logging: true,
    entities: [Product, User],
    subscribers: [],
    migrations: [],
});
