const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
    type: String,
    required: true
    },
    precio: {
    type: Number,
    required: true
    },
    stock: {
    type: Number,
    required: true
    },
    marca: {
    type: String,
    default: ''
    },
    categoria: {
    type: String,
    default: ''
    },
    descripcion_corta: {
    type: String,
    required: true
    },
    descripcion_larga: {
    type: String,
    default: ''
    },
    envio_sin_cargo: {
    type: Boolean,
    default: false
    },
    edad_desde: {
    type: Number,
    default: null
    },
    edad_hasta: {
    type: Number,
    default: null
    },
    foto: {
    type: String,
    default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Producto', productoSchema);
