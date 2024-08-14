import bodyParser from 'body-parser';
import './instrument';
<<<<<<< HEAD
import * as Sentry from '@sentry/node';
import * as express from 'express';
import * as cron from 'node-cron';
=======
const Sentry = require('@sentry/node');
import express from 'express';
import cron from 'node-cron';
>>>>>>> 99bfc3a (test: Implement test cases)
import { Response, Request } from 'express';
import { Server } from 'http';
import morganMiddleware from './config/morganMiddleware';
import Worker from './worker/index';
import dbConnectionHandler from '../src/mongoDB/connection';
import SocketHelper from './helpers/socket.helper';
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
   public count: number;

   constructor() {
      (async () => {
         this.app = express();
         this.initializeMiddlewares();
         this.initializeControllers();
         this.count = 0;
         this.CronWorker();
         this.NativeWorker();
         this.BidWorker();
         this.PriceUpdateWorker();
         this.ResultCheckWorker();
      })();
   }

   public listen() {
      Sentry.setupExpressErrorHandler(this.app);
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
      this.app.use(function onError(
         _err: any,
         req: Request,
         res: any,
         _next: express.NextFunction
      ) {
         res.statusCode = 500;
         res.end(res.sentry + '\n');
      });
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
      Worker.Native();
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
