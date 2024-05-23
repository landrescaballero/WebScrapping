import { chromium } from 'playwright';

export const getMercadoLibre = async (product) => {
  if (typeof product !== 'string') {
    return {
      error: 'El producto debe ser un string',
      status: 400,
    };
  }
  const browser = await chromium.launch({});
  const page = await browser.newPage();
  try {
    await page.goto(`https://listado.mercadolibre.com.co/${product}`);

    // Espera a que la página de resultados de búsqueda esté lista
    await page.waitForSelector('.ui-search-layout__item')


    const productElements = await page.$$('.ui-search-result__wrapper');

    if (productElements.length === 0) {
      return {
        error: 'No se encontraron productos',
        status: 404,
      };
    }

    // Iterar sobre cada elemento para extraer la información
    const productos = [];
    for (const element of productElements) {
      const title = await element.$eval('a.ui-search-link h2', node => node.textContent.trim());
      const url = await element.$eval('a.ui-search-link', node => node.href);
      const imageUrl = await element.$eval('img.ui-search-result-image__element', node => node.src);
      const price = await element.$eval('.andes-money-amount__fraction', node => node.textContent.trim());
      const priceElements = price.split('.');
      const priceNumber = parseInt(priceElements.join(''));

      // Agregar la información del producto al array de productos
      if (title.toUpperCase().includes(product.toUpperCase())) {
        productos.push({ title, url, imageUrl, price: priceNumber, page: 'Mercado Libre' });
      }
      if (productos.length === 5) {
        break;
      }
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
