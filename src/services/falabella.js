import { chromium } from 'playwright';

export const getFalabella = async (product) => {
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
        await page.goto(`https://www.falabella.com.co/falabella-co/search?Ntt=${product}`);

        // Espera a que todos los elementos estén presentes en la página
        await page.waitForSelector('.subTitle-rebrand');

        // Espera a que las imágenes estén completamente cargadas
        await page.waitForLoadState('networkidle');

        // Obtener todos los elementos que coincidan con la estructura proporcionada
        let productContainers = await page.$$('.jsx-1484439449');

        if (productContainers.length === 0) {
            productContainers = await page.$$('.jsx-2481219049');

            if (productContainers.length === 0) {
                return {
                    error: 'No se encontraron productos',
                    status: 404,
                };
            }
        }

        // Iterar sobre cada contenedor y extraer la información deseada
        const productos = [];
        for (const container of productContainers) {
            try {
                // Obtener la URL del src de la imagen del producto
                const imageUrl = await container.$eval('picture img', img => img.getAttribute('src'));
                

                // Obtener la URL que lleva al producto
                const productURL = await container.$eval('.pod-link', link => link.getAttribute('href'));
                const url = productURL.startsWith('http') ? productURL : `https://www.falabella.com.co${productURL}`;
                

                // Obtener el nombre del producto
                const title = await container.$eval('.pod-subTitle', name => name.textContent.trim());
                

                // Obtener el precio del producto
                const productPrice = await container.$eval('.copy10.medium', price => price.textContent.trim());
                const priceString = productPrice.replace('$', '').replace(/\./g, '').trim();
                const priceNumber = parseInt(priceString, 10);
                

                productos.push({ title, url, imageUrl, price: priceNumber, page: 'Falabella' });
                if (productos.length >= 5) {
                    break;
                }
            } catch (err) {
                console.error('Error al extraer datos del producto:', err);
            }
        }


        if (productos.length === 0) {
            return {
                error: 'No se encontraron productos',
                status: 404,
            };
        }
        // Sacar los productos que no contengan el nombre del producto
        const filteredProducts = productos.filter(producto => {
            let answer = false;
            const titleFixed = producto.title.replace(/\s+/g, '');
            // 
            // console.log('product:', product);
            (titleFixed.toUpperCase().includes(product.replace(/\s+/g, '').toUpperCase()))
                ? answer = true
                : answer = false
            return answer
        });

        // Tomar solo los 3 productos más baratos
        filteredProducts.sort((a, b) => a.price - b.price);
        const top3Productos = filteredProducts.slice(0, 3);

        // Cierra el navegador
        await browser.close();

        // Retorna un mensaje de éxito
        return {
            productos: top3Productos,
            status: 200,
        };
    } catch (error) {
        // Cierra el navegador en caso de error
        await browser.close();
        return {
            error: `Error al obtener los datos: ${error}`,
            status: 500,
        };
    }
}

