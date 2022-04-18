import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Tesando o endpoint /login', () => {
  describe('Quando enviamos um email inválido', () => {
    let chaiHttpResponse: Response;
    const body = {
      email: 'mailmailcom',
      password: '123456'
    }

    it('Retorna um status 401 e com a messagem de erro', async () => {
      chaiHttpResponse = await chai.request(app)
      .post('/login')
      .send(body)
      .then((res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.be.eql({ message: 'Incorrect email or password'})
      }) as Response;
    });
  });
});