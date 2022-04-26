import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import Club from '../database/models/Club';

const clubs = require('./data/clubs.json');



chai.use(chaiHttp);

const { expect } = chai;

describe('Testando a rota /clubs', () => {
  describe('Retornando todos os clubs', () => {
    beforeEach(sinon.restore)
    let chaiHttpResponse: Response;

    it('Se tiver algum club cadastrado retorna status 200 e array de objetos', async () => {
      sinon.stub(Club, 'findAll').resolves(clubs);
      chaiHttpResponse = await chai.request(app)
      .get('/clubs')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.eql(clubs);
      }) as Response;
    });

    it('Se não tiver nenhum club cadastrado retorna uma array vazio e status 200', async () => {
      sinon.stub(Club, 'findAll').resolves([]);
      chaiHttpResponse = await chai.request(app)
      .get('/clubs')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.eql([]);
      }) as Response;
    });
  });
});

describe('Testando a rota /clubs/:id', () => {
  describe('Buscando por um club específico', () => {
    beforeEach(sinon.restore)
    let chaiHttpResponse: Response;

    it('Se encontrar um club específico retorna um objeto e status 200', async () => {
      sinon.stub(Club, 'findOne').resolves(clubs[1]);

      chaiHttpResponse = await chai.request(app)
      .get('/clubs/2')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.eql(clubs[1])
      }) as Response;
    });

    it('Se não encontrar um club específico, retorna messagem de erro e status 404', async () => {
      sinon.stub(Club, 'findOne').resolves(undefined);

      chaiHttpResponse = await chai.request(app)
      .get('/clubs/231')
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.be.eql({ message: 'Club Not Found' });
      }) as Response;
    });
  });
});