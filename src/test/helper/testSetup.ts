import dbConnectionHandler from '../../mongoDB/connection';
// import * as config from '../../config';
describe('ModelHelper', () => {
   let mongodbMock: any;

   beforeAll(() => {
      // const isLoaded =  config.loadEnvs();
      mongodbMock = {
         query: jest.fn(),
      };
      mongodbMock = dbConnectionHandler.createDBConnection();
   });

   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(process, 'exit').mockImplementation(() => {
         throw new Error('process.exit() called.');
      });
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it('should complete migration successfully', async () => {
      jest.mock('../../models/Block/index', () => ({
         Block: {
            sync: jest.fn().mockResolvedValue(true),
         },
      }));
      jest.mock('../../models/Currency/index', () => ({
         Currency: {
            sync: jest.fn().mockResolvedValue(true),
         },
      }));
      jest.mock('../../models/Events/index', () => ({
         Events: {
            sync: jest.fn().mockResolvedValue(true),
            updateOne: jest.fn(),
         },
      }));
      jest.mock('../../models/Order/index', () => ({
         Order: {
            sync: jest.fn().mockResolvedValue(true),
            updateMany: jest.fn(),
         },
      }));
      jest.mock('../../models/Transaction/index', () => ({
         Transaction: {
            sync: jest.fn().mockResolvedValue(true),
            belongsTo: jest.fn(),
         },
      }));
   });
});
