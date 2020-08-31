import express, { Express } from 'express';
import { avito } from './routes/avitoRoute';
import { autoru } from './routes/autoruRoute';
import { all } from './routes/allRoute';

export class Server {
  private _port: number;
  private _app: Express;

  constructor(port: number) {
    this._port = port;
    this._app = express();
  }

  private configureServer() {
    this._app.use(express.json());
  }

  private setRouter() {
    this._app.use('/avito', avito);
    this._app.use('/autoru', autoru);
    this._app.use('/', all);
  }

  startServer() {
    this.configureServer();
    this.setRouter();

    this._app.listen(this._port, () => {
      console.log(`Server starded on port ${this._port}...`);
    });
  }
}