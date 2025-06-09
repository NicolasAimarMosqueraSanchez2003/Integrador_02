const express = require('express');
const router = express.Router();
const { guardarCarrito, verCarrito } = require('../controllers/carrito.controller');
const Producto = require('../models/producto.model');

router.post('/', guardarCarrito);
router.get('/', verCarrito);

router.post('/eliminar-uno', (req, res) => {
    const { productoId } = req.body;

    if (!req.session.carrito || !req.session.carrito.productos) {
        return res.redirect('/carrito');
    }

    let productos = req.session.carrito.productos;

    const index = productos.findIndex(p => {
        if (typeof p === 'string') {
            return p === productoId;
        } else if (typeof p === 'object') {
            return p.id === productoId || p._id === productoId;
        }
        return false;
    });

    if (index !== -1) {
        productos.splice(index, 1);
    } else {
        console.log('Producto no encontrado en carrito para eliminar una unidad');
    }

    let total = 0;
    productos.forEach(p => {
        if (typeof p === 'object') {
            total += p.precio || 0;
        }
    });

    req.session.carrito.productos = productos;
    req.session.carrito.total = total;

    res.redirect('/carrito');
});

router.post('/comprar', (req, res) => {
  if (req.session.carrito) {
    req.session.carrito.productos = [];
    req.session.carrito.total = 0;
  }
  res.redirect('/carrito');
});

module.exports = router;