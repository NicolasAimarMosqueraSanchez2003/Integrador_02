const Producto = require('../models/producto.model');

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
};

// Obtener producto por ID
const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener producto' });
    }
};

// Crear nuevo producto
const crearProducto = async (req, res) => {
    try {
        const {
            nombre, precio, stock, marca, categoria,
            descripcion_corta, descripcion_larga,
            envio_sin_cargo, edad_desde, edad_hasta
        } = req.body;

        const nuevoProducto = new Producto({
            nombre,
            precio,
            stock,
            marca,
            categoria,
            descripcion_corta,
            descripcion_larga,
            envio_sin_cargo: envio_sin_cargo === 'on',
            edad_desde,
            edad_hasta,
            foto: req.file ? `/uploads/${req.file.filename}` : null
        });

        await nuevoProducto.save();
        console.log('✅ Producto guardado:', nuevoProducto);
        res.redirect('/');
    } catch (error) {
        console.error('❌ Error al crear producto:', error);
        res.status(500).send('Error del servidor');
    }
};

// Actualizar producto
const actualizarProducto = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Convertir campos que necesitan ajustes
        updateData.envio_sin_cargo = req.body.envio_sin_cargo === 'on';

        // Si se sube una nueva imagen
        if (req.file) {
            updateData.foto = `/uploads/${req.file.filename}`;
        }

        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!productoActualizado) {
            return res.status(404).send('Producto no encontrado');
        }

        console.log('✅ Producto actualizado:', productoActualizado);
        res.redirect('/');
    } catch (error) {
        console.error('❌ Error al actualizar producto:', error);
        res.status(500).send('Error al actualizar producto');
    }
};


// Eliminar producto
const eliminarProducto = async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoEliminado) return res.status(404).json({ mensaje: 'Producto no encontrado' });
        res.json({ mensaje: 'Producto eliminado' });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al eliminar producto' });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
