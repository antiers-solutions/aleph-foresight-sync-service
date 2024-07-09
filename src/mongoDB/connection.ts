import mongoose from 'mongoose';
import '../connection';
import { log } from '../utils/helper.utils';
import { mongoDb, connections } from '../utils/constant.util';
import * as Sentry from '@sentry/node';

// Database connection and events handler class
class DBConnectionHandler {
   static instance: DBConnectionHandler = null;

   static getInstance = () => {
      if (!DBConnectionHandler.instance) {
         DBConnectionHandler.instance = new DBConnectionHandler();
         delete DBConnectionHandler.constructor;
      }
      return DBConnectionHandler.instance;
   };

   /**
    * connect to the mongodb server
    * @returns boolean
    */
   createDBConnection = async () => {
      try {
         this._bindMongoConnectionEvents();
         await mongoose.connect(process.env.MONGO_URI, {
            connectTimeoutMS: 40000,
         });
         return true;
      } catch (err) {
         Sentry.captureException(err);
         log.red(mongoDb.errorLog, err);
         return false;
      }
   };

   /**
    * release the database connection
    */
   releaseDBConnection = async () => {
      await mongoose.disconnect();
   };

   //***************** internal used methods *************************/

   /**
    * for binding the mongodb connection events
    */
   _bindMongoConnectionEvents = () => {
      try {
         // fired when connected to mongodb
         mongoose.connection.on(connections.connecting, () => {
            log.blue(mongoDb.connecting);
         });

         // fired when connected to mongodb
         mongoose.connection.on(connections.connected, () => {
            log.green(mongoDb.connected);
         });

         // fired when mongodb connection is disconnected
         mongoose.connection.on(connections.disconnected, () => {
            log.blue(mongoDb.disconnected);
         });

         //fired when error occur in mongodb connection
         mongoose.connection.on(connections.error, (err: Error) => {
            Sentry.captureException(err);
            log.red(mongoDb.onError, err);

            // for future usage
            // this.createDBConnection();
         });
      } catch (err) {
         Sentry.captureException(err);

         log.red(mongoDb.onErrorBinding, err);
      }
   };
}

const dbConnectionHandler = DBConnectionHandler.getInstance();
export default dbConnectionHandler;
