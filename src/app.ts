import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as cron from 'node-cron';
import { Response, Request } from 'express';
import { Server } from 'http';
import morganMiddleware from './config/morganMiddleware';
import { chainInitialise } from './common/chain.common';
import Worker from './worker/index';
import dbConnectionHandler from '../src/mongoDB/connection';
import SocketHelper from './helpers/socket.helper';
import worker from './worker/index';
import { mongoDb } from './utils/constant.util';
declare global {
   // eslint-disable-next-line @typescript-eslint/no-namespace
   namespace NodeJS {
      interface Global {
         socket?: Socket;
      }
   }
}

const globalData: any = global;

class App {
   public app: express.Application;
   public api: any;
   public count: number;

   constructor() {
      (async () => {
         this.app = express();
         this.initializeMiddlewares();
         this.initializeControllers();
         this.api = await chainInitialise('Native chain');
         this.count = 0;
         this.CronWorker();
         this.NativeWorker();
         this.BidWorker();
         this.PriceUpdateWorker();
         this.ResultCheckWorker();
      })();
   }

   public listen() {
      const instance: Server = this.app.listen(
         process.env.PORT ? process.env.PORT : 7200,
         () => {
            console.log(
               `App listening on the port ${
                  process.env.PORT ? process.env.PORT : 7200
               }`
            );
         }
      );
      this.socketConnect(instance);
      const isDBconnected = dbConnectionHandler.createDBConnection();
      if (!isDBconnected) throw new Error(mongoDb.connectionIssue);
   }

   public getServer(): express.Application {
      return this.app;
   }

   private initializeMiddlewares() {
      this.app.use(bodyParser.json());
      this.app.use(morganMiddleware);
   }

   private initializeControllers() {
      this.app.get('/status', (req: Request, res: Response) => {
         res.status(200).json({ status: 'API Service is UP' });
      });
   }

   async CronWorker() {
      cron.schedule('*/5 * * * *', async () => {
         console.log('CronWorker');
      });
   }

   async NativeWorker() {
      Worker.Native(await this.api);
   }

   async BidWorker() {
      Worker.BidCheck();
   }
   async PriceUpdateWorker() {
      Worker.PriceUpdate();
   }

   async ResultCheckWorker() {
      Worker.ResultCheck();
   }

   private socketConnect(serverInstance: Server) {
      /*eslint-disable */
      const io = require('socket.io')(serverInstance);
      globalData.socket = io;
      global = globalData;
      new SocketHelper(io);
   }
}
export default App;
