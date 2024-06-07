import { Request, Response } from 'express';
const { connect } = require('../../connection');
const Log = connect.loadSchema('Log', require('./index'));

Log.syncDB(function (err: Error) {
   if (err) throw err;
});

class LogHelper {
   saveLogs = async (payload: object) => {
      const log = new Log(payload);
      log.save((err: Error) => {
         if (err) {
            console.log(err);
            return;
         }
      });
   };

   readLogs = async (req: Request, res: Response) => {
      const query = req.body || {};
      return new Promise((resolve, reject) => {
         Log.find(
            query,
            { allow_filtering: true, raw: true },
            (error: Error, logs: Array<any>) => {
               if (error) {
                  console.log(error);
                  reject(res.status(500).send(error));
               }
               resolve(res.status(200).send(logs));
            }
         );
      });
   };
}

export default new LogHelper();
