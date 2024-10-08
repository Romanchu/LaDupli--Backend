import express from 'express';
import { AppDataSource } from './persistance/db';
import { mainRouter } from './router/routes';
import { Product } from './persistance/product';
import { User } from './persistance/user';
import cors from 'cors';
import { config } from 'dotenv';
import 'dotenv/config';

// Mostrar variables de entorno (opcional)
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
config();

const app = express();
const port = 8080;

// Configuración de CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: 'http://localhost:3000', // Asegúrate de que el frontend está corriendo en este puerto
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
    credentials: true // Habilita el uso de cookies
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas principales
app.use('/', mainRouter);

AppDataSource.initialize()
    .then(async () => {
        console.log('Base de datos conectada');

        // Productos de ejemplo
        const validation_product = AppDataSource.manager.getRepository(Product);
        const product_exist = await validation_product.find();
        if (product_exist.length == 0) {
            const product1 = new Product(
                'https://imgs.search.brave.com/AUibPgk1Z25t3UbUVU16XIMVyeyjZFfVYgmDhKU-L3I/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91bmRl/cndhdmVicmFuZC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjMvMDUvRFNDMDc4/OTQtMS5qcGc', 
                "Remera Oversize negra", 5000, 5
            );
            const product2 = new Product(
                'https://imgs.search.brave.com/Mei0Rs5phPofNkohB7JNLD8vyxOB-Jj_a1erHE9qHog/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9OUV9OUF84/NTY4NzctTUxBNTIx/MjUxMDc2NjBfMTAy/MDIyLVcud2VicA', 
                "Remera Oversize blanca", 5000, 1
            );
            await AppDataSource.manager.save([product1, product2]);
            console.log('Productos de ejemplo insertados');
        }

        // Usuario de ejemplo
        const validation_user = AppDataSource.manager.getRepository(User);
        const user_exist = await validation_user.find();
        if (user_exist.length == 0) {
            const user1 = new User("prueba123", "prueba@gmail.com", "12345678");
            await AppDataSource.manager.save([user1]);
            console.log('Usuario de ejemplo insertado');
        }

        // Iniciar el servidor
        app.listen(port, () => {
            console.log(`Servidor corriendo en: http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Error al conectar la base de datos:', err);
    });
