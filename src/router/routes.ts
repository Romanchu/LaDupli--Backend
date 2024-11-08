import { Router, Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../persistance/db';
import { User } from '../persistance/user';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import multer from 'multer';

interface AuthenticatedRequest extends Request {
    user?: JwtPayload | string;
}

// Configuración de multer para manejar la subida de imágenes
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/');
    },
    filename: (_, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

const mainRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

// Middleware de autenticación para verificar el token JWT
const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).send({ message: 'Acceso denegado. Se requiere autenticación.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(403).send({ message: 'Falta inicio de sesión.' });
    }
};

// Ruta de salud para verificar la conexión
mainRouter.get('/health', async (_: Request, res: Response) => {
    res.send('ok');
});

// Ruta para registro de usuarios
mainRouter.post('/registro', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOneBy({ email });

        if (existingUser) {
            return res.status(400).send({ message: 'Correo ya registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User(username, email, hashedPassword);
        await userRepository.save(newUser);
        return res.status(201).send({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        return res.status(500).send({ message: 'Error en el servidor', error });
    }
});

// Ruta para inicio de sesión
mainRouter.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ message: 'Correo o contraseña incorrectos' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).send({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        return res.status(500).send({ message: 'Error en el servidor', error });
    }
});

// Ruta para enviar pedido
mainRouter.post('/enviar-pedido', verifyToken, upload.single('imagen'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { producto, opcionSeleccionada, cantidadMetros, email, detallesAdicionales } = req.body;
        const imagen = req.file;

        // Configuración de transporte de correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        // Configuración del correo
        const mailOptions = {
            from: `"Cliente" <${email}>`,
            to: process.env.EMAIL_USER,
            subject: 'Nuevo Pedido Realizado',
            html: `
                <h1>Nuevo Pedido Realizado</h1>
                <p><strong>Producto:</strong> ${producto}</p>
                <p><strong>Opción seleccionada:</strong> ${opcionSeleccionada}</p>
                <p><strong>Cantidad en metros:</strong> ${cantidadMetros}</p>
                <p><strong>Especificaciones adicionales:</strong> ${detallesAdicionales}</p>
                <p><strong>Correo del comprador:</strong> ${email}</p>
            `,
            attachments: imagen ? [{ filename: imagen.originalname, path: imagen.path }] : [],
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send({ message: 'Error al enviar el correo' });
    }
});

// Ruta para obtener perfil de usuario
mainRouter.get('/perfil', verifyToken, (req: AuthenticatedRequest, res: Response) => {
    return res.status(200).send({ message: 'Token válido', user: req.user });
});

export { mainRouter };

