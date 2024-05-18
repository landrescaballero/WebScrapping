import { chromium } from 'playwright';
import getMercadoLibre from './mercado-libre.js';
import getExito from './exito.js';
import getAlkosto from './alkosto.js';
import getOlimpica from './olimpica.js';


//async funtion autocalled
(async () => {
  const productToSearch = 'iphone 14'

  //* Mercadolibre
  // console.log('Buscando productos en Mercado Libre');
  // const getFromMercadoLibre = await getMercadoLibre(productToSearch);
  // console.log('Datos obtenidos correctamente de Mercado Libre');
  // console.log(getFromMercadoLibre);


  //* Exito
  // console.log('Buscando productos en Exito');
  // const getFromExito = await getExito(productToSearch);
  // console.log('Datos obtenidos correctamente de Exito');
  // (getFromExito.error) 
  // ? console.log(getFromExito.error) 
  // : console.log(getFromExito);

  //* Alkosto
  // console.log('Buscando productos en Alkosto');
  // const getFromAlkosto = await getAlkosto(productToSearch);
  // console.log('Datos obtenidos de Alkosto');
  // (getFromAlkosto.error) 
  // ? console.log(getFromAlkosto.error) 
  // : console.log(getFromAlkosto);

  //* Olimpica
  console.log('Buscando productos en Alkosto');
  const getFromOlimpica = await getOlimpica(productToSearch);
  console.log('Datos obtenidos de Olimpica');
  (getFromOlimpica.error)
    ? console.log(getFromOlimpica.error)
    : console.log(getFromOlimpica);
})();