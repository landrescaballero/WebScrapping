import { chromium } from 'playwright';
import getMercadoLibre from './mercado-libre.js';
import getExito from './exito.js';


//async funtion autocalled
(async () => {
  const productToSearch = 'iphone 14'

  //* Mercadolibre
  // console.log('Buscando productos en Mercado Libre');
  // const getFromMercadoLibre = await getMercadoLibre(productToSearch);
  // console.log('Datos obtenidos correctamente de Mercado Libre');
  // console.log(getFromMercadoLibre);


  //* Exito
  console.log('Buscando productos en Exito');
  const getFromExito = await getExito(productToSearch);
  console.log('Datos obtenidos correctamente de Exito');
  (getFromExito.error) 
  ? console.log(getFromExito.error) 
  : console.log(getFromExito);
})();



// const browser = await chromium.launch()
// const page = await browser.newPage()
// await page.goto('https://betplay.com.co');
// await page.waitForLoadState('domcontentloaded')
// await page.click(".menu-button");
// await page.click("a[data-menu-item='Deportes']")
// await page.waitForLoadState('domcontentloaded')
// await page.click(".KambiBC-applied-terms__placeholder")
// await page.$eval( '#KambiBC-term-search-overlay__input', element => {
//     element.value = 'Real Madrid';
// })
// await page.keyboard.type(' ')
// await page.waitForTimeout(2000)
// await page.keyboard.press('Enter')

// await page.waitForSelector(`.KambiBC-event-item__bet-offer-count`)

// const offers = await page.$$('.KambiBC-event-item__bet-offer-count')

// const textOffers = await Promise.all(offers.map(async off => await off.innerHTML()))

// console.log(textOffers);

// await browser.close()


/*let html = ''
offers.forEach(  off => {
  const temp =  off.innerHTML()
  html += `<h1>${ temp }</h1>`
})

console.log(html);*/

//document.getElementById('app').innerHTML = hmtl*/

