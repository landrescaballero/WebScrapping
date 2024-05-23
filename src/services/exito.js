import { chromium } from 'playwright';

export const getExito = async (product) => {
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
    await page.goto(`https://www.exito.com/s?q=${product}`);

    // Espera a que los resultados carguen, ajusta el selector y el tiempo según sea necesario
    await page.waitForSelector('[data-testid="store-product-card"]');

    await page.waitForLoadState('networkidle');

    // Selecciona todos los elementos con data-testid="store-product-card"
    const products = await page.$$('[data-testid="store-product-card"]');
    // const products = await page.$$('div');
    // console.log('lenght:',products.length);

    if (products.length === 0) {
      return {
        error: 'No se encontraron productos',
        status: 404,
      };
    }
    // Iterar sobre cada elemento para extraer la información
    const productos = [];
    for (const element of products) {
      // console.log(await element.innerHTML());
      const imageUrl = await element.$eval('img[data-fs-img="true"]', img => img.src);

      // Selecciona el segundo enlace con data-testid="product-link" para el título y href
      const linkElements = await element.$$('a[data-testid="product-link"]');
      const titleElement = linkElements[1];
      const title = await titleElement.innerText();
      const linkHref = await titleElement.getAttribute('href');
      const url = `https://www.exito.com${linkHref}`;

      const price = await element.$eval('[data-fs-container-price-otros="true"]', p => p.innerText);
      // reemplazar $ por espacio y convertir a numero
      const priceString = price.replace('$', '').replace(/\./g, '');
      const priceNumber = parseInt(priceString);


      if (title.toUpperCase().includes(product.toUpperCase())) {
        productos.push({ title, url, imageUrl, price: priceNumber, page: 'Exito' });
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

