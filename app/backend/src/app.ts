import * as express from 'express';
import { Request, Response } from 'express';
import LoginController from './controller/login.controller';

const login = new LoginController();

class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.config();
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);

    this.app.post('/login', async (req: Request, res: Response) => {
      const { email, password } = req.body;
      const result = await login.logining(email, password);
      res.status(200).json(result);
    });
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.warn('Listen on', PORT));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
