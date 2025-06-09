const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // carpeta donde guardar las imágenes
    },
    filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // nombre único
    }
});

const upload = multer({ storage: storage });

// Ruta POST con multer
router.post('/', upload.single('foto'), productoController.crearProducto);

// Otras rutas (GET, PUT, DELETE)
router.get('/', productoController.obtenerProductos);
router.get('/:id', productoController.obtenerProductoPorId);
router.put('/:id', upload.single('foto'), productoController.actualizarProducto);
router.delete('/:id', productoController.eliminarProducto);

const Producto = require('../models/producto.model');

// Vista para ver productos con imagen
router.get('/vista', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.render('productos', { productos });
    } catch (error) {
        res.status(500).send('Error al cargar productos');
    }
});

module.exports = router;