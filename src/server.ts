import * as config from './config';
(async () => {
   await config.initiate();
})();
import App from './app';

const app = new App();

app.listen();
