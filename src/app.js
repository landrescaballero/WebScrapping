import express, { Router } from 'express';
import path from 'path';
import {getAlkosto} from './services/alkosto.js';
import {getExito} from './services/exito.js';
import {getFalabella} from './services/falabella.js';
import {getMercadoLibre} from './services/mercado-libre.js';
import {getOlimpica} from './services/olimpica.js';

(async () => {
    main();
})();

function main() {

    const app = express();

    //*Middlewares
    app.use(express.json()); //? raw
    app.use(express.urlencoded({ extended: true })); //? x-www-form-urlencoded


    //*Public Folder    
    app.use(express.static('public'));

    //* Routes
    // Alkosto
    app.get('/alkosto/:producto', async (req, res) => {
        const productos = await getAlkosto(req.params.producto);
        if (productos.error) {
            console.log(productos.error);
        }
        res.status(productos.status).json(productos.productos);
    });

    // Exito
    app.get('/exito/:producto', async (req, res) => {
        const productos = await getExito(req.params.producto);
        if (productos.error) {
            console.log(productos.error);
        }
        res.status(productos.status).json(productos.productos);
    });

    // Falabella
    app.get('/falabella/:producto', async (req, res) => {
        const productos = await getFalabella(req.params.producto);
        if (productos.error) {
            console.log(productos.error);
        }
        res.status(productos.status).json(productos.productos);
    });

    // Mercado Libre
    app.get('/mercado-libre/:producto', async (req, res) => {
        const productos = await getMercadoLibre(req.params.producto);
        if (productos.error) {
            console.log(productos.error);
        }
        res.status(productos.status).json(productos.productos);
    });

    // Olimpica
    app.get('/olimpica/:producto', async (req, res) => {
        const productos = await getOlimpica(req.params.producto);
        if (productos.error) {
            console.log(productos.error);
        }
        res.status(productos.status).json(productos.productos);
    });
    
    // Todas las tiendas
    app.get('/productos/:producto', async (req, res) => {
        let productos = [];
        const productosOlimpica =await getOlimpica(req.params.producto);
        const productosAlkosto = await getAlkosto(req.params.producto);
        const productosExito = await getExito(req.params.producto);
        const productosFalabella = await getFalabella(req.params.producto);
        const productosMercadoLibre = await getMercadoLibre(req.params.producto);
        productos = productos.concat(productosOlimpica.productos, productosAlkosto.productos, productosExito.productos, productosFalabella.productos, productosMercadoLibre.productos);
        let status = 200;
        if (productosOlimpica.error || productosAlkosto.error || productosExito.error || productosFalabella.error || productosMercadoLibre.error) {
            console.log(productos.error);
            status = 500;
        }
        res.status(status).json(productos);
    });


    //* SPA
    app.get('/', (req, res) => {
        const indexPath = path.join(__dirname, `../public/index.html`);
        res.sendFile(indexPath);
        return;

    });


    app.listen(3000, () => {
        console.log(`Server is running on port 3000`);

    });

}