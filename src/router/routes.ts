import { Router } from 'express';
import { AppDataSource } from '../persistance/db';
import { User } from '../persistance/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const mainRouter = Router();

// Clave secreta para firmar el token
const JWT_SECRET = 'edbc91713593317201e1a60c99d0764e5742a86799eeca6284aa8318b34dfd74106bdca6f197902f6fe06b93adf49acadc637bd2af474ae5ea3b35f04dadf9b8';

// Ruta para registro de usuarios
mainRouter.post('/registro', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Busca si ya existe un usuario con el mismo correo
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOneBy({ email });

        if (existingUser) {
            // Si ya existe un usuario con ese correo, devuelve un error
            return res.status(400).send({ message: 'Correo ya registrado' });
        }

        // Encripta la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea una nueva instancia de User con la contraseña encriptada
        const newUser = new User(username, email, hashedPassword);
        
        // Guarda el nuevo usuario en la base de datos
        await AppDataSource.manager.save(newUser);
        return res.status(201).send({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        return res.status(500).send({ message: 'Error en el servidor', error });
    }
});

// Ruta para inicio de sesión
mainRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Busca al usuario por email
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });

        // Si el usuario no existe o la contraseña no es correcta
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ message: 'Correo o contraseña incorrectos' });
        }

        // Genera el token JWT
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        // Envía el token al frontend
        return res.status(200).send({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        return res.status(500).send({ message: 'Error en el servidor', error });
    }
});

// Ruta protegida (ejemplo)
mainRouter.get('/perfil', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Obtiene el token del encabezado "Authorization"

    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    try {
        // Verifica el token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Aquí podrías devolver información del usuario autenticado
        return res.status(200).send({ message: 'Token válido', user: decoded });
    } catch (error) {
        return res.status(403).send({ message: 'Token inválido' });
    }
});

export { mainRouter };


