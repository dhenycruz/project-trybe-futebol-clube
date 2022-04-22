import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import User from '../database/models/User';
import AuthToken from '../token/token';

chai.use(chaiHttp);

const { expect } = chai;

describe('Tesando o endpoint /login', () => {
  beforeEach(sinon.restore)
  describe('Quando enviamos um email inválido', () => {
    beforeEach(sinon.restore)
    let chaiHttpResponse: Response;
    const body = {
      email: 'mailmailcom',
      password: '123456'
    }

    it('Email no formatado errado retorna status 401 e messagem de erro', async () => {
      chaiHttpResponse = await chai.request(app)
      .post('/login')
      .send(body)
      .then((res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.be.eql({ message: 'Incorrect email or password' });
      }) as Response;
    });

    it('Email não existe no banco de dados, retorna status 401 e messagem de erro', async () => {
      sinon.stub(User, 'findAll').resolves([]);

      chaiHttpResponse =  await chai.request(app)
      .post('/login')
      .send({ email: 'dhenycruz@mail.com', password: '123456' })
      .then((res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.be.eql({ message: 'Incorrect email or password'});
      }) as Response;
    });
  });

  /* Requisito 9 */
  describe('Quando enviamos uma senha inválida', () => {
    let chaiHttpResponse: Response;
    const user = [{
      id: 1,
      username: 'dheny',
      role: 'admin',
      email: 'dhenycruz@mail.com',
      password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
    }]

    it('Se a senha não bater com a senhda do banco de dados, retorna status 401 e messagem de erro', async () => {
      sinon.stub(User, 'findAll').resolves(user as User[]);

      chaiHttpResponse =  await chai.request(app)
      .post('/login')
      .send({ email: 'dhenycruz@mail.com', password: '123445' })
      .then((res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.be.eql({ message: 'Incorrect email or password'});
      }) as Response;
    });
  });

  /* req 11 */
  describe('Quando não enviamos um email no login', () => {
    let chaiHttpResponse: Response;
    const body = {
      password: 'asdf'
    }

    it('Retorna status 401 e com a messagem de erro', async () => {
      chaiHttpResponse = await chai.request(app)
      .post('/login')
      .send(body)
      .then((res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.be.eql({ message: 'All fields must be filled' });
      }) as Response;
    });
  });

  /* req 13 */
  describe('Quando não enviamos um password no login', () => {
    let chaiHttpResponse: Response;
    const body = {
      email: 'dheniarley@mail.com'
    }

    it('Retorna status 401 e com a messagem de erro', async () => {
      chaiHttpResponse = await chai.request(app)
      .post('/login')
      .send(body)
      .then((res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.be.eql({ message: 'All fields must be filled' });
      }) as Response;
    });
  });

  /* req 5 */
  describe('Fazendo o login com sucesso', () => {

    let chaiHttpResponse;
    const body = {
      email:'dheniarley@mail.com',
      password: 'secret_admin'
    }

    const user = {
      id: 1,
      username: 'dheny',
      role: 'admin',
      email: 'dheniarley@mail.com',
      password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
    }

    const userRes = {
      id: 1,
      username: 'dheny',
      role: 'admin',
      email: 'dheniarley@mail.com'
    }

    const token = 'tokengerado';

    it('Retorna status 201, mais um objeto com dados do usuário logado e seu toekn', async () => {
      sinon.stub(User, 'findAll').resolves([user] as User[]);
      sinon.stub(AuthToken, 'createToken').resolves(token);

      chaiHttpResponse = await chai.request(app)
      .post('/login')
      .send(body)
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.keys('user', 'token');
      }) as Response;
    });
  });
});

describe('Testando o endpoint /login/validate', () => {
  describe('Quando nao passa um token', () => {
    beforeEach(sinon.restore)
    let chaiHttpResponse: Response;

    it('Retorna status 401', async () => {
      chaiHttpResponse = await chai.request(app)
      .get('/login/validate')
      .then((res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.be.eql({ message: 'No authorization!' });
      }) as Response;
    });
  });

  describe('Quando passa um token inválido', () => {
    beforeEach(sinon.restore);
    let chaiHttpResponse: Response;

    it('Retorna status 401 e a mesagem de No authorization!', async () => {
      chaiHttpResponse = await chai.request(app)
      .get('/login/validate')
      .set('authorization', 'notoken')
      .then((res) => {
        expect(res.status).to.be.equal(401);
         expect(res.body).to.be.eql({ message: 'No authorization!' });
      }) as Response
    })
  });

  describe('Quando passa um token válido', () => {
    beforeEach(sinon.restore);
    let chaiHttpResponse: Response;

    it('Retorna status 200 e o role do user', async () => {
      sinon.stub(AuthToken, 'authToken').resolves({ auth: true, user: 'admin'});

      chaiHttpResponse = await chai.request(app)
      .get('/login/validate')
      .set('authorization', 'tokenvalido')
      .then((res) => {
        expect(res.status).to.be.equal(200);
         expect(res.body).to.be.eql({ auth: true, user: 'admin'});
      }) as Response
    })
  });
});