import { chromium } from "playwright";

export const getOlimpica = async (product) => {
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
        await page.goto(`https://www.olimpica.com/${product}`);


        // Esperar a que todos los elementos estén presentes en la página
        await page.waitForSelector('.vtex-search-result-3-x-galleryItem');

        // Obtener todos los elementos que coincidan con la estructura proporcionada
        const productElements = await page.$$('.vtex-search-result-3-x-galleryItem');

        if (productElements.length === 0) {
            return {
                error: 'No se encontraron productos',
                status: 404,
            };
        }

        // Iterar sobre cada elemento y extraer la información deseada
        const productos = [];
        for (const element of productElements) {
            // Obtener la URL del src de la imagen del producto
            const imageUrl = await element.$eval('.vtex-product-summary-2-x-imageNormal', img => img.getAttribute('src'));

            // Obtener la URL que lleva al producto
            const productURL = await element.$eval('a.vtex-product-summary-2-x-clearLink', link => link.getAttribute('href'));
            const url = `https://www.olimpica.com${productURL}`
            // Obtener el nombre del producto
            const title = await element.$eval('.vtex-product-summary-2-x-brandName', name => name.textContent.trim());

            // Obtener el precio del producto
            const productPrice = await element.$eval('.vtex-product-price-1-x-sellingPriceValue', price => price.textContent.trim());
            const priceString = productPrice.replace('$', '').replace(/\./g, '');
            const priceNumber = parseInt(priceString);


            productos.push({ title, url, imageUrl, price: priceNumber, page: 'Olimpica' });


        }

        if (productos.length === 0) {
            return {
                error: 'No se encontraron productos',
                status: 404,
            };
        }

        //tomar solo los 3 productos mas baratos de productos[]
        productos.sort((a, b) => a.price - b.price);
        productos.splice(3, productos.length - 3);

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

export default getOlimpica;