import { Server } from 'http';
import request from 'supertest';
import App from '../app'; // Adjust the import path as necessary

jest.mock('../mongoDB/connection');
jest.mock('../worker/index');
jest.mock('../helpers/socket.helper');

describe('App', () => {
   let app: App;
   let server: Server;

   beforeAll(async () => {
      app = new App();
      server = await new Promise<Server>((resolve) => {
         const srv = app.getServer().listen(0, () => resolve(srv));
      });
   });

   afterAll(async () => {
      return new Promise<void>((resolve) => {
         server.close(() => resolve());
      });
   });
   beforeAll(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {
         //
      });
      jest.spyOn(console, 'info').mockImplementation(() => {
         //
      });
      jest.spyOn(console, 'error').mockImplementation(() => {
         //
      });
   });

   afterAll(() => {
      jest.restoreAllMocks();
   });

   it('should respond with status 200 for /status endpoint', async () => {
      const response = await request(app.getServer()).get('/status');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'API Service is UP' });
   });

   it('should call the CronWorker function', async () => {
      // Mock the cron.schedule function to verify it gets called
      const cronScheduleMock = jest.spyOn(require('node-cron'), 'schedule');
      await app.CronWorker();
      expect(cronScheduleMock).toHaveBeenCalledWith(
         '*/5 * * * *',
         expect.any(Function)
      );
   });

   it('should handle database connection errors', async () => {
      // Mock the database connection handler to simulate an error
      const dbConnectionHandler = require('../mongoDB/connection');
      dbConnectionHandler.createDBConnection = jest.fn().mockReturnValue(false);

      // Reinitialize the app to simulate the error
      app = new App();
      expect(() => app.listen()).toThrowError('Unable to connect mongodb');
   });
});
