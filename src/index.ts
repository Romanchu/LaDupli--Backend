import express from 'express';
import { AppDataSource } from './persistance/db';
import { mainRouter } from './router/routes';
import { Product } from './persistance/product';
import { User } from './persistance/user';
import cors from 'cors';
import { config } from 'dotenv';
import 'dotenv/config';

config(); // Cargar variables de entorno desde .env

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
        console.log('Base de datos SQLite conectada');

        // Productos de ejemplo
        const productRepository = AppDataSource.getRepository(Product);
        const existingProducts = await productRepository.find();
        if (existingProducts.length === 0) {
            const product1 = new Product(
                'https://imgs.search.brave.com/AUibPgk1Z25t3UbUVU16XIMVyeyjZFfVYgmDhKU-L3I/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91bmRl/cndhdmVicmFuZC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjMvMDUvRFNDMDc4/OTQtMS5qcGc', 
                "Remera Oversize negra", 5000, 5
            );
            const product2 = new Product(
                'https://imgs.search.brave.com/Mei0Rs5phPofNkohB7JNLD8vyxOB-Jj_a1erHE9qHog/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9OUV9OUF84/NTY4NzctTUxBNTIx/MjUxMDc2NjBfMTAy/MDIyLVcud2VicA', 
                "Remera Oversize blanca", 5000, 1
            );
            await productRepository.save([product1, product2]);
            console.log('Productos de ejemplo insertados');
        }

        // Usuario de ejemplo
        const userRepository = AppDataSource.getRepository(User);
        const existingUsers = await userRepository.find();
        if (existingUsers.length === 0) {
            const user1 = new User("prueba123", "prueba@gmail.com", "12345678");
            await userRepository.save(user1);
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
