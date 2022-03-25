import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

/* testando controller login */
describe('Testando o endpoint login', () => {
  let chaiHttpResponse: Response;

  it('retorna uma resposta com status 200 se o login for feito com sucesso', async () => {
    const body = {
      email: 'dhenymail.com',
      password: 'test123'
    }

    const bodyResponse = {
      "user": {
        "id": 1,
        "username": "Admin",
        "role": "admin",
        "email": "admin@admin.com"
      },
      "token": "123.456.789" // Aqui deve ser o token gerado pelo backend.
    }

    chaiHttpResponse = await chai.request(app)
    .get('/login')
    .send(body)
    .then((res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.eql(bodyResponse);
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