import * as express from 'express';
import * as cors from 'cors';
import loginRoute from './routes/login.route';
import clubRouter from './routes/club.route';
import matchRouter from './routes/match.route';
import leaderBoardRouter from './routes/leaderboard.route';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.config();
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
    this.app.use(cors());
    this.app.use(loginRoute);
    this.app.use(clubRouter);
    this.app.use(matchRouter);
    this.app.use(leaderBoardRouter);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.warn('Listen on', PORT));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
