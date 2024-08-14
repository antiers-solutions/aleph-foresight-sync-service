import request from 'supertest';
import express from 'express';
import morganMiddleware from '../config/morganMiddleware';
import { Logger } from '../logger';

jest.mock('../logger');

describe('Morgan Middleware', () => {
   const app = express();

   // Apply morgan middleware
   app.use(morganMiddleware);

   app.get('/test', (req, res) => {
      res.status(200).send('Test route');
   });

   // it('should log requests with the custom logger', async () => {
   //   // Mock the Logger method
   //   (Logger.http as jest.Mock).mockImplementation(() => { undefined });

   //   // Make a request to the test route
   //   await request(app).get('/test');

   //   // Check if Logger.http was called
   //   // expect(Logger.http).toHaveBeenCalled();
   // });

   it('should skip logging in production', async () => {
      process.env.NODE_ENV = 'production';

      // Reset mocks
      (Logger.http as jest.Mock).mockReset();

      // Make a request to the test route
      await request(app).get('/test');

      // Check that Logger.http was not called
      expect(Logger.http).not.toHaveBeenCalled();

      // Reset environment for other tests
      process.env.NODE_ENV = 'development';
   });
});
