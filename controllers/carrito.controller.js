const Carrito = require('../models/carrito.model');

const guardarCarrito = async (req, res) => {
    try {
        const { productos: nuevosProductos, total: nuevoTotal } = req.body;

        console.log("📦 Recibido en carrito:", nuevosProductos, "💰 Total:", nuevoTotal);

        if (!Array.isArray(nuevosProductos) || nuevosProductos.length === 0) {
            return res.status(400).json({ mensaje: 'La lista de productos no puede estar vacía.' });
        }

        const carritoActual = req.session.carrito || { productos: [], total: 0 };

        carritoActual.productos.push(...nuevosProductos);

        carritoActual.total = carritoActual.total + nuevoTotal;

        req.session.carrito = carritoActual;

        console.log('🛒 Carrito actualizado en sesión:', req.session.carrito);

        res.status(201).json({ mensaje: 'Producto añadido al carrito.' });
    } catch (error) {
        console.error('❌ Error en guardarCarrito:', error.message);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};



const verCarrito = (req, res) => {
    const carrito = req.session.carrito || { productos: [], total: 0 };

    // Agrupar productos repetidos
    const agrupados = {};

    carrito.productos.forEach(prod => {
        const clave = prod.id;
        if (!agrupados[clave]) {
            agrupados[clave] = { ...prod, cantidad: 1, id: clave };
        } else {
            agrupados[clave].cantidad += 1;
        }
    });

    // Convertir el objeto agrupado en array
    const productosAgrupados = Object.values(agrupados);

    res.render('carrito', {
        carrito: {
            productos: productosAgrupados,
            total: carrito.total
        }
    });
};

module.exports = {
    verCarrito,
    guardarCarrito,
};
