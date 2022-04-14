import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';
import exp from 'constants';

chai.use(chaiHttp);

const { expect } = chai;


/* testando controller login */
describe('Testando o endpoint login', () => {
  let chaiHttpResponse: Response;

  /* Requisito 04 */
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
    .post('/login')
    .send(body)
    .then((res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.eql(bodyResponse);
    }) as Response;
  });

  /* Requisito 06 */
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

  /* requisito 09 */
  it('Se for informado uma senha inválida deverá retornar um erro', async () => {
    const body = {
      email: 'email@email.com',
      password: '123'
    }

    chaiHttpResponse = await chai.request(app)
    .post('/login')
    .send(body)
    .then((res) => {
      expect(res.status).to.be.equal(401);
      expect(res.body).to.be.eql({ message: 'Incorrect email or password' });
    }) as  Response;
  });

  /* requisito 11 */
  it('Se não informar o email deverá retornar um erro', async () => {
    const body = {
      password: '123'
    }

    chaiHttpResponse = await chai.request(app)
    .post('/login')
    .send(body)
    .then((res) => {
      expect(res.status).to.be.equal(401);
      expect(res.body).to.be.equal({ message: 'All fields must be filled'});
    }) as Response;
  });

  /* requisito 13 */
  it('Se não informar o password deverá retornar um erro', async () => {
    const body = {
      email: 'admin@admin.com'
    }

    chaiHttpResponse = await chai.request(app)
    .post('/login')
    .send(body)
    .then((res) => {
      expect(res.status).to.be.equal(401);
      expect(res.body).to.be.equal({ message: 'All fields must be filled' });
    }) as Response;
  })
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