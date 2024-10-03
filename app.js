const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

// Endpoint para obtener todos los productos
app.get('/productos', (req, res) => {
  const query = 'SELECT * FROM productos';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Endpoint para agregar un nuevo producto
app.post('/productos', (req, res) => {
  const { nombre, precio, cantidad } = req.body;
  const query = 'INSERT INTO productos (nombre, precio, cantidad) VALUES (?, ?, ?)';
  db.query(query, [nombre, precio, cantidad], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, nombre, precio, cantidad });
  });
});

// Servidor escuchando en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
db.query('SELECT 1', (err, results) => {
    if (err) {
      console.log('Error ejecutando la consulta de prueba:', err);
    } else {
      console.log('Conexión y consulta de prueba exitosa:', results);
    }
  });
app.get('/productos', (req, res) => {
   db.query('SELECT * FROM productos', (err, results) => {
     if (err) {
       console.error('Error al obtener productos:', err);
       res.status(500).send('Error en el servidor');
     } else {
       res.json(results);
     }
   });
});
  
