import {check} from 'k6';
import http from 'k6/http';
import Utils from '../utils/utils.js';
import * as faker from 'faker/locale/pt_BR';


export default class Products {

  constructor() {
    this.productId = ''
  }

  list() {
    let params = {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'monitor': false,
      },
    };
    let response = http.get(`${Utils.getBaseUrl()}/produtos`, params)
    check(response, {
      'is status 200': () => response.status === 200,
    })
  }

  add(auth) {
    let payload = JSON.stringify({
      nome: faker.commerce.productName(),
      preco: faker.commerce.price(),
      descricao: faker.lorem.words(6),
      quantidade: 999
    })

    let params = {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': auth,
        'monitor': false,
      },
    };

    let response = http.post(`${Utils.getBaseUrl()}/productos`, payload, params)
    this.productId = response.json('_id')
    console.info(`Agregar el producto con id ${this.productId}`)
    check(response, {
      'is status 201': () => response.status === 201,
    });
  }

  delete(auth) {
    let params = {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': auth,
        'monitor': false,
      },
    };
    let response = http.del(`${Utils.getBaseUrl()}/productos/${this.productId}`, null, params)
    console.info(`Producto eliminado con id ${this.productId}`)
    check(response, {
      'is status 200': () => response.status === 200,
    });
  }
}