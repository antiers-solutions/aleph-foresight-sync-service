import * as readline from 'node:readline';
import * as config from './config';
import * as Admin from './repanda/admin';
import * as Producer from './repanda/producer';
import * as Consumer from './repanda/consumer';
import App from './app';
import { kafka } from './utils/constant.util';

const app = new App();

app.listen();

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});

async function start() {
   const topic = kafka.syncService;
   await Admin.createTopic(topic);
   await Consumer.connect();
   rl.question('', async function (username) {
      const sendMessage = await Producer.getConnection(username);
      if (sendMessage) {
         rl.on('line', (input) => {
            readline.moveCursor(process.stdout, 0, -1);
            sendMessage(input);
         });
      } else {
         console.error(kafka.initialiseFailed);
      }
   });
}
start();
process.on(kafka.sigint, async () => {
   console.log(kafka.close);
   try {
      await Producer.disconnect();
      await Consumer.disconnect();
      rl.close();
   } catch (err) {
      console.error(kafka.cleanupError, err);
      process.exit(1);
   } finally {
      console.log(kafka.cleanupFinish);
      process.exit(0);
   }
});

(async () => {
   await config.initiate();
})();
