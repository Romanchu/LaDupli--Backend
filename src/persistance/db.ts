import { DataSource } from 'typeorm'; // Asegúrate de tener instalado TypeORM
import { Product } from './product';  // Importa tus entidades (Productos y Usuarios en este caso)
import { User } from './user';
import 'dotenv/config';  // Asegúrate de importar dotenv para cargar el archivo .env

// Imprimir los valores de las variables de entorno para verificar que se cargan correctamente
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

// Configuración de TypeORM para conectarse a MySQL usando las variables de entorno
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),   // Asegúrate de convertir el puerto a número
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,  // Solo para desarrollo, sincroniza automáticamente las entidades con la base de datos
    dropSchema: true,
    logging: true,
    entities: [Product, User],  // Incluye tus entidades aquí
    subscribers: [],
    migrations: []
});