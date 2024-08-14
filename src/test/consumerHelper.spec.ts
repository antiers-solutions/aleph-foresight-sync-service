import Web3 from 'web3'; // This will use the mocked version
const Sentry = require('@sentry/node');
import Events from '../models/Events/index';
import {
   resultCall,
   getEventResult,
   eventOdds,
} from '../helpers/consumer.helper'; // Adjust path as needed
import { errorLog } from '../utils/constant.util';

// Mock environment variables
process.env.SOCKET_HOST = 'http://localhost:8545';
process.env.ADMIN = '0xYourPrivateKey';
process.env.CONTRACT_ADDRESS = '0xYourContractAddress';

// Mock external libraries and modules
jest.mock('web3');
jest.mock('@sentry/node');
jest.mock('../models/Events/index');
jest.mock('../models/Transaction/index');
jest.mock('../utils/constant.util');

describe('Blockchain Contract Functions', () => {
   const mockContract = {
      methods: {
         set_result_event: jest.fn(() => ({
            estimateGas: jest.fn().mockResolvedValue(21000),
            encodeABI: jest.fn().mockReturnValue('0x12345'),
         })),
         read_pool_amount_event: jest.fn(() => ({
            call: jest.fn().mockResolvedValue('0xAdminAddress'),
         })),
         current_odds_event: jest.fn(() => ({
            call: jest.fn().mockResolvedValue('1.5'),
         })),
      },
   };

   beforeEach(() => {
      (Web3 as unknown as jest.Mock).mockImplementation(() => ({
         eth: {
            Contract: jest.fn(() => mockContract),
            accounts: {
               wallet: {
                  add: jest.fn(() => ({ address: '0xYourAccountAddress' })),
               },
               signTransaction: jest.fn().mockResolvedValue({
                  rawTransaction: '0xSignedTransaction',
               }),
            },
            getTransactionCount: jest.fn().mockResolvedValue(1),
            getGasPrice: jest.fn().mockResolvedValue('20000000000'),
            sendSignedTransaction: jest.fn().mockResolvedValue({}),
         },
         utils: {
            toHex: jest.fn((val) => val.toString(16)),
         },
      }));
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   describe('resultCall', () => {
      it('should execute a transaction and update the event status', async () => {
         const eventId = 'event123';
         const resultType = 'win';

         const updateMock = jest.fn().mockResolvedValue({});
         Events.findOneAndUpdate = updateMock;

         const result = await resultCall(eventId, resultType);

         expect(result).toBe(true);
         expect(mockContract.methods.set_result_event).toHaveBeenCalledWith(
            eventId.trim(),
            resultType.trim()
         );
         expect(updateMock).toHaveBeenCalledWith(
            { eventId: eventId },
            { status: 2 }
         );
      });

      it('should log an error and return false on failure', async () => {
         const eventId = 'event123';
         const resultType = 'win';

         // Force an error
         (Web3 as unknown as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Mocked Error');
         });

         const result = await resultCall(eventId, resultType);

         expect(result).toBe(false);
         expect(Sentry.captureException).toHaveBeenCalled();
         expect(errorLog).toHaveBeenCalled();
      });
   });

   describe('getEventResult', () => {
      it('should retrieve the event result from the contract', async () => {
         const eventId = 'event123';

         const result = await getEventResult(eventId);

         expect(result).toBe('0xAdminAddress');
         expect(
            mockContract.methods.read_pool_amount_event
         ).toHaveBeenCalledWith(eventId.trim());
      });

      it('should log an error and return false on failure', async () => {
         const eventId = 'event123';

         // Force an error
         (Web3 as unknown as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Mocked Error');
         });

         const result = await getEventResult(eventId);

         expect(result).toBe(false);
         expect(Sentry.captureException).toHaveBeenCalled();
         expect(errorLog).toHaveBeenCalled();
      });
   });

   describe('eventOdds', () => {
      it('should retrieve the event odds from the contract', async () => {
         const eventId = 'event123';

         const result = await eventOdds(eventId);

         expect(result).toBe('1.5');
         expect(mockContract.methods.current_odds_event).toHaveBeenCalledWith(
            eventId.trim()
         );
      });

      it('should log an error and return false on failure', async () => {
         const eventId = 'event123';

         // Force an error
         (Web3 as unknown as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Mocked Error');
         });

         const result = await eventOdds(eventId);

         expect(result).toBe(false);
         expect(Sentry.captureException).toHaveBeenCalled();
         expect(errorLog).toHaveBeenCalled();
      });
   });
});
