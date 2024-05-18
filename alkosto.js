import { chromium } from "playwright";

async function getAlkosto(product) {
    if (typeof product !== 'string') {
        return {
            error: 'El producto debe ser un string',
        };
    }
    const browser = await chromium.launch({
        headless: false,
        slowMo: 50,
    });
    const page = await browser.newPage();
    try {
        await page.goto('https://www.alkosto.com/');

        // Espera a que el campo de búsqueda esté listo utilizando data-testid
        await page.waitForSelector('#js-site-search-input');

        // Ingresa el producto en el campo de búsqueda y presiona Enter
        await page.click('#js-site-search-input');
        await page.keyboard.type(product);
        await page.keyboard.press('Enter');

        // Espera a que los resultados carguen
        await page.waitForSelector('.ais-InfiniteHits-item');

        // Selecciona todos los elementos de producto
        const products = await page.$$('.ais-InfiniteHits-item');

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
            productos.push({ title, url, imageUrl, price: priceNumber });
            if (productos.length >= 5) {
                break;
            }
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
            msg: 'Datos obtenidos correctamente',
            productos,
        };
    } catch (error) {
        // Cierra el navegador
        await browser.close();
        return {
            error: `Error al obtener los datos: ${error}`,
        }
    }
}

export default getAlkosto;