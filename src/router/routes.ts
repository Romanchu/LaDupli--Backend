import { Router } from 'express';
import { AppDataSource } from '../persistance/db';
import { User } from '../persistance/user';

const mainRouter = Router();

mainRouter.get('/', (_, res) => {
    res.send('Hola');
});

// Ruta para registro de usuarios
mainRouter.post('/registro', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Crea una nueva instancia de User con los tres parámetros esperados
        const newUser = new User(username, email, password);
        
        // Guarda el nuevo usuario en la base de datos
        await AppDataSource.manager.save(newUser);
        res.status(201).send('Usuario registrado exitosamente');
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

export { mainRouter };
