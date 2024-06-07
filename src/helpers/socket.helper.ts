const { Logger } = require('../logger');

class SocketHelper {
   public io: any;

   constructor(io: any) {
      this.io = io;
      this.checkConnection();
   }

   checkConnection(): void {
      this.io
         .on('connection', () => {
            Logger.info('Socket connected successfully');
         })
         .on('error', (error: any) => {
            Logger.error('error ' + error);
         });
   }
}

export default SocketHelper;
