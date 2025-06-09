const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
    productos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    }],
    total: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Carrito', carritoSchema);
