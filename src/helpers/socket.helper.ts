import { connections, socketSuccess } from '../utils/constents.util';

const { Logger } = require('../logger');

class SocketHelper {
   public io: any;

   constructor(io: any) {
      this.io = io;
      this.checkConnection();
   }

   checkConnection(): void {
      this.io
         .on(connections.connection, () => {
            Logger.info(socketSuccess);
         })
         .on(connections.error, (error: any) => {
            Logger.error(`${connections.error} ${error}`);
         });
   }
}

export default SocketHelper;
