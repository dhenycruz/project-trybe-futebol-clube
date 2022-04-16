import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

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

  /* Requisito 05 */
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
  });

  /* requisito 14 */
  it('Verificará se tentar bater na rota com um token válido, o mesmo retornará o tipo de usuário', async () => {
    const body = {
      email: 'admin@admin.com',
      password: 'secret_admin'
    }

    chaiHttpResponse = await chai.request(app)
    .post('/login/validate')
    .send(body)
    .then((res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.equal('admin');
    }) as Response;
  });
});

/* testando endpoint clubs */
describe('Testando endpoit clubs', () => {
  let chaiHttpResponse: Response;

  /* requisito 16 */
  it('retorna uma resposta com status 200 e com json com os clubes', async () => {
    chaiHttpResponse = await chai.request(app)
    .get('/clubs')
    .then((res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.eql(clubs);
    }) as Response;
  });

  /* requisito 17 */
  it('retorna uma resposta com status 200 e com json com um clube específico', async () => {
    chaiHttpResponse = await chai.request(app)
    .get('/clubs/1')
    .then((res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.eql(clubs[0]);
    }) as Response;
  });
});

describe('Testando endpoint matchs', () => {
  let chaiHttpResponse: Response;

  /* requisito 19 */
  it('Retorna uma resposta com status 200 e com json com as partidas', async () => {
    chaiHttpResponse = await chai.request(app)
    .get('/matchs')
    .then((res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.eql(matchs);
    }) as Response;
  });

  /* requisito 20 */
  it('retornar uma lista de partidas em progresso, filtradas por uma queryString', async () => {
    chaiHttpResponse = await chai.request(app)
    .get('/matchs?inProgress=true')
    .then((res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.eql(matchsInProgressTrue);
    }) as Response;
  });

  /* requisito 21 */
  it('retornar uma lista de partidas finalizadas, filtradas por uma queryString', async () => {
    chaiHttpResponse = await chai.request(app)
    .get('/matchs?inProgress=false')
    .then((res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.eql(matchsInProgressFalse);
    }) as Response;
  });

  /* requisito 23 */
  it('Cadastra um novo jogo no banco de dados e retorna esse jogo', async () => {
    const body = {
      "homeTeam": 16,
      "awayTeam": 8,
      "homeTeamGoals": 2,
      "awayTeamGoals": 2,
      "inProgress": true
    };

    const bodyResponse = {
      "id": 1,
      "homeTeam": 16,
      "homeTeamGoals": 2,
      "awayTeam": 8,
      "awayTeamGoals": 2,
      "inProgress": true,
    }

    chaiHttpResponse = await chai.request(app)
    .post('/matchs')
    .send(body)
    .then((res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.eql(bodyResponse);
    }) as Response;
  });
  /* requisito 24 */
  it('A rota finaliza uma partida especifica através do id passato pela url', async () => {
    const body = {
      homeTeam: 16,
      awayTeam: 8,
      homeTeamGoals: 2,
      awayTeamGoals: 2
    }

    chaiHttpResponse = await chai.request(app)
    .patch('/matchs/1/finish')
    .send(body)
    .then((res) => {
      expect(res.status).to.be.equal(200);
    }) as Response;
  });

  /* requisito 25 */
  it('Testa que não é possível inserir uma partida com times iguais', async () => {
    const body = {
      "homeTeam": 3,
      "awayTeam": 3,
      "homeTeamGoals": 2,
      "awayTeamGoals": 2,
      "inProgress": 1
    }

    chaiHttpResponse = await chai.request(app)
    .post('/matchs')
    .send(body)
    .then((res) => {
      expect(res.status).to.be.equal(401);
      expect(res.body).to.be.eql({ message: 'It is not possible to create a match with two equal teams' });
    }) as Response;
  });

  /* requisito 26 */
  it('Testa que não é possível inserir uma partida com time que não existe na tabela clubs', async () => {
    const body = {
      "homeTeam": 59,
      "awayTeam": 3,
      "homeTeamGoals": 2,
      "awayTeamGoals": 2,
      "inProgress": 1
    }

    chaiHttpResponse = await chai.request(app)
    .post('/matchs')
    .send(body)
    .then((res) => {
      expect(res.status).to.be.equal(401);
      expect(res.body).to.be.eql({ message: 'There is no team with such id!' });
    }) as Response;
  });

  /* requisito 27 */
  it('A rota atualiza o resultado de uma partida específica', async () => {
    const body = {
      homeTeamGoals: 3,
      awayTeamGoals: 2
    }

    chaiHttpResponse = await chai.request(app)
    .patch('/matchs/1')
    .send(body)
    .then((res) => {
      expect(res.status).to.be.equal(200);
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