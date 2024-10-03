import express from 'express';
import { addProductsToDB, addUserToDB, getProducts, loginUser } from '../controler/controler';
const mainRouter = express.Router();

mainRouter.get('/', (_, res) => {
    res.send('Hola');
});

mainRouter.get('/producto', getProducts);
mainRouter.post('/anadir', addProductsToDB);
mainRouter.post('/registro', addUserToDB);
mainRouter.post('/login', loginUser)

export { mainRouter };  