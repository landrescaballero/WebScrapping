import { chromium } from 'playwright';

async function getExito(product) {
  if (typeof product !== 'string') {
    return {
      error: 'El producto debe ser un string',
    };
  }
  const browser = await chromium.launch({
    // headless: false,
    // slowMo: 50,
  });
  const page = await browser.newPage();
  try {
    await page.goto('https://www.exito.com/');

    // Espera a que el campo de búsqueda esté listo utilizando data-testid
    await page.waitForSelector('[data-testid="store-input"]');

    // Ingresa el producto en el campo de búsqueda y presiona Enter
    await page.click('[data-testid="store-input"]');
    await page.keyboard.type(product);
    await page.keyboard.press('Enter');

    // Espera a que los resultados carguen, ajusta el selector y el tiempo según sea necesario
    await page.waitForSelector('[data-testid="store-product-card"]');

    // Selecciona todos los elementos con data-testid="store-product-card"
    const products = await page.$$('[data-testid="store-product-card"]');
    // const products = await page.$$('div');
    // console.log('lenght:',products.length);

    // Iterar sobre cada elemento para extraer la información
    const productos = [];
    for (const element of products) {
      // console.log(await element.innerHTML());
      const imageUrl = await element.$eval('a[data-testid="product-link"] img[data-fs-img="true"]', img => img.src);

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
        productos.push({ title, url, imageUrl, price: priceNumber });
      }
      if (productos.length === 5) {
        break;
      }
    }

    //tomar solo los 3 productos mas baratos de productos[]
    productos.sort((a, b) => a.price - b.price);
    productos.splice(3, productos.length - 3);

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

export default getExito;
