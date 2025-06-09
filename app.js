const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const hbs = require('hbs');

dotenv.config();

const productoRoutes = require('./routes/producto.routes');
const carritoRoutes = require('./routes/carrito.routes');

// Modelos para renderizar datos en vistas
const Producto = require('./models/producto.model');
const Carrito = require('./models/carrito.model');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de motor de plantillas (Handlebars)
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerHelper('multiply', (a, b) => a * b);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'unSecretMuySeguro',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 } // 10 minutos
}));

// Rutas API
app.use('/api/productos', productoRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/carrito', carritoRoutes);


// Ruta principal (vista de productos)
app.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.render('index', { productos });
    } catch (error) {
        res.status(500).send('Error al cargar productos');
    }
});
app.get('/contacto', (req, res) => {
    res.render('contacto');
});
app.get('/alta', (req, res) => {
    res.render('alta');
});
app.get('/nosotros', (req, res) => {
    res.render('nosotros');
});
app.get('/carrito', async (req, res) => {
    try {
        const carrito = req.session.carrito || { productos: [], total: 0 };

        const productosDB = await Producto.find({ _id: { $in: carrito.productos } });

        const grouped = {};
        carrito.productos.forEach(id => {
            const producto = productosDB.find(p => p._id.equals(id));
            if (producto) {
                if (!grouped[id]) {
                    grouped[id] = { ...producto.toObject(), cantidad: 1, total: producto.precio };
                } else {
                    grouped[id].cantidad++;
                    grouped[id].total += producto.precio;
                }
            }
        });

        const groupedProductos = Object.values(grouped);

        res.render('carrito', {
            carrito,
            groupedProductos
        });
    } catch (error) {
        console.error('❌ Error al mostrar carrito:', error);
        res.status(500).send('Error al cargar el carrito');
    }
});
app.get('/buscar', async (req, res) => {
  try {
    const query = req.query.q;
    const productos = await Producto.find({
      nombre: { $regex: query, $options: 'i' }  // búsqueda insensible a mayúsculas
    });

    res.render('index', { productos });
  } catch (error) {
    console.error('❌ Error en búsqueda:', error);
    res.status(500).send('Error al buscar productos');
  }
});


// Formulario de edición (vista)
app.get('/productos/editar/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).send('Producto no encontrado');
        res.render('editar', { producto });
    } catch (error) {
        res.status(500).send('Error al cargar el producto');
    }
});


// Ruta que recibe el carrito desde formulario del frontend
app.post('/enviar-carrito', async (req, res) => {
    try {
        const carritoJson = JSON.parse(req.body.carritoJson);
        const nuevoCarrito = new Carrito(carritoJson);
        await nuevoCarrito.save();
        console.log("🛒 Carrito guardado desde frontend:", carritoJson);
        res.redirect('/');
    } catch (error) {
        console.error('❌ Error al guardar carrito:', error);
        res.status(500).send('Error al guardar carrito');
    }
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conectado a MongoDB Atlas');
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
})
.catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
});
