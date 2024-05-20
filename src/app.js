import express, { Router } from 'express';
import path from 'path';
import {getAlkosto} from './services/alkosto.js';

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
        res.status(productos.status).json(productos.productos);
    });

    // Exito
    app.get('exito/:producto', async (req, res) => {
        const productos = await getExito(req.params.producto);
        res.status(productos.status).json(productos.productos);
    });

    // Falabella
    app.get('falabella/:producto', async (req, res) => {

    });

    // Mercado Libre
    app.get('mercado-libre/:producto', async (req, res) => {

    });

    // Olimpica
    app.get('olimpica/:producto', async (req, res) => {

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