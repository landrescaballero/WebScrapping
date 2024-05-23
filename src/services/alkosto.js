import { chromium } from "playwright";

export const getAlkosto = async (product) => {
    if (typeof product !== 'string') {
        return {
            error: 'El producto debe ser un string',
            status: 400,
        };
    }
    const browser = await chromium.launch({
        // headless: false,
        // slowMo: 50,
    });
    const page = await browser.newPage();
    try {
        await page.goto(`https://www.alkosto.com/search/?text=${product}`);

        // Espera a que los resultados carguen
        await page.waitForSelector('.product__item__top__title');

        // Selecciona todos los elementos de producto
        const products = await page.$$('.product__item');

        if (products.length === 0) {
            return {
                error: 'No se encontraron productos',
                status: 404,
            };
        }

        // Extrae información de los productos
        const productos = [];
        for (const element of products) {
            const title = await element.$eval('.product__item__top__title', el => el.innerText.trim());
            const linkHref = await element.$eval('.product__item__top__title', el => el.getAttribute('data-url'));
            const url = `https://www.alkosto.com${linkHref}`
            const imageUrl = await element.$eval('.product__item__information__image img', img => img.src);
            const price = await element.$eval('.product__item__information__price .product__price--discounts__price .price', el => el.innerText.trim());
            const priceString = price.replace('$', '').replace(/\./g, '');
            const priceNumber = parseInt(priceString);
            productos.push({ title, url, imageUrl, price: priceNumber, page: 'Alkosto' });
            if (productos.length >= 5) {
                break;
            }
        }
        if (productos.length === 0) {
            return {
                error: 'No se encontraron productos',
                status: 404,
            };
        }
        //console.log("productos antes de sortear:", productos);
        //tomar solo los 3 productos mas baratos de productos[]
        productos.sort((a, b) => a.price - b.price);
        productos.splice(3, productos.length - 3);
        // console.log("productos sorteados", productos);
        // console.log(productos.length);
        // Cierra el navegador
        await browser.close();
        // Retorna un mensaje de éxito
        return {
            productos,
            status: 200,
        };
    } catch (error) {
        // Cierra el navegador
        await browser.close();
        return {
            error: `Error al obtener los datos: ${error}`,
            status: 500,
        }
    }
}
