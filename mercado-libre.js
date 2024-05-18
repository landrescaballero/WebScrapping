import { chromium } from 'playwright';

async function getMercadoLibre(product) {
  if (typeof product !== 'string') {
    return {
      error: 'El producto debe ser un string',
    };
  }
  const browser = await chromium.launch({});
  const page = await browser.newPage();
  try {
    await page.goto('https://www.mercadolibre.com.co/');

    // Espera a que el campo de búsqueda esté listo
    await page.waitForSelector('#cb1-edit');

    // Ingresa el producto en el campo de búsqueda y presiona Enter
    await page.click("#cb1-edit");
    await page.keyboard.type(product);
    await page.keyboard.press('Enter');

    // Espera a que la página de resultados de búsqueda esté lista
    await page.waitForLoadState('domcontentloaded')


    await page.waitForFunction(() => document.querySelector('img.ui-search-result-image__element').complete);



    const productElements = await page.$$('.ui-search-result__wrapper');

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
        productos.push({ title, url, imageUrl, price: priceNumber });
      }
      if (productos.length === 5) {
        break;
      }
    }

    //tomar solo los 3 productos mas baratos de productos[]
    productos.sort((a, b) => a.price - b.price);
    productos.splice(3, productos.length - 3);
    


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

export default getMercadoLibre;
