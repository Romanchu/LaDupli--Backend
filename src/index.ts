import express from 'express';
import { AppDataSource } from './persistance/db';
import { mainRouter } from './router/routes';
import { Product } from './persistance/product'
import { User } from './persistance/user';
import  cors from 'cors';
import { config } from 'dotenv';
import 'dotenv/config';


console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
config();
const database = process.env.DATABASE_NAME
console.log(database)
const username = process.env.DATABASE_USERNAME
console.log(username)
const password = process.env.DATABASE_PASSWORD
console.log(password)
const host = process.env.DATABASE_HOST
console.log(host)

const app = express();
const port = 8080;

app.use(function(_,res, next){
    res.header("Acces-Control-Allow-Origin", "https://localhost:3000");
    res.header("Acces-Control-Allow-Headers", "Origins, X-Requested-Width, Content, Accept");
    next();
})
app.use (cors()); 
app.use(express.json());
app.use ('/' , mainRouter);



AppDataSource.initialize()
    .then(async() => {
        console.log('Base de datos conectada');

//productos
        const validation_product = AppDataSource.manager.getRepository(Product)
        const product_exist = await validation_product.find()
        if (product_exist.length == 0){
            const product1 = new Product('https://imgs.search.brave.com/AUibPgk1Z25t3UbUVU16XIMVyeyjZFfVYgmDhKU-L3I/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91bmRl/cndhdmVicmFuZC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjMvMDUvRFNDMDc4/OTQtMS5qcGc',"Remera Oversize negra", 5000, 5);
            const product2 = new Product('https://imgs.search.brave.com/Mei0Rs5phPofNkohB7JNLD8vyxOB-Jj_a1erHE9qHog/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9OUV9OUF84/NTY4NzctTUxBNTIx/MjUxMDc2NjBfMTAy/MDIyLVcud2VicA', "Remera Oversize blanca", 5000, 1);
            AppDataSource.manager.save([product1, product2])
            console.log(product_exist)
        }

//usuario
        const validation_user = AppDataSource.manager.getRepository(User)
        const user_exist = await validation_user.find()
        if (user_exist.length == 0){
            const user1 = new User("prueba123" , "prueba@gmail.com", "12345678")
            AppDataSource.manager.save([user1])
            console.log(user_exist)
        }
        app.listen(port, () => {
            console.log(`Servidor: http://localhost:${port}`);
        });
    })
    .catch(err => {
        throw err
    });