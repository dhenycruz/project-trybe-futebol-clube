import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import Club from '../database/models/Club';

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';

const clubs = require('./data/clubs.json');
const matchs = require('./data/matchs.json');
const matchsInProgressTrue = require('./data/matchsInProgressTrue.json');
const matchsInProgressFalse = require('./data/matchsInProgressFalse.json');

chai.use(chaiHttp);

const { expect } = chai;


/* testando endpoit login */
describe('Testando o endpoint login', () => {
  let chaiHttpResponse: Response;

  /* Requisito 07 */
  it('Se não for informado um email inválido, deverá retornar um erro 401', async () => {
    const body = {
      email: 'mailmail.com',
      password: '1234123'
    };

    chaiHttpResponse = await chai.request(app)
    .post('/login')
    .send(body)
    .then((res) => {
      expect(res.status).to.be.equal(401);
      expect(res.body).to.be.eql({ message: 'Incorrect email or password'});
    }) as Response;
  });
});

/* testando endpoint clubs */
describe('Testando endpoit clubs', () => {
  let chaiHttpResponse: Response;

  /* requisito 16 */  
  it('retorna uma resposta com status 200 e com json com os clubes', async () => {
    sinon.stub(Club, 'findAll').resolves(clubs);
    chaiHttpResponse = await chai.request(app)
    .get('/clubs')
    .then((res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.eql(clubs);
    }) as Response;
  });
});


/* describe('Seu teste', () => {
   // Exemplo do uso de stubs com tipos

  // let chaiHttpResponse: Response;

  // before(async () => {
  //   sinon
  //     .stub(Example, "findOne")
  //     .resolves({
  //       ...<Seu mock>
  //     } as Example);
  // });

  // after(()=>{
  //   (Example.findOne as sinon.SinonStub).restore();
  // })

  // it('...', async () => {
  //   chaiHttpResponse = await chai
  //      .request(app)
  //      ...

  //   expect(...)
  // });

  it('Seu sub-teste', () => {
    expect(false).to.be.eq(true);
  });
});
 */