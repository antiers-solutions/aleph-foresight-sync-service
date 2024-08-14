import { errorLog } from '../utils/constant.util';
import Order from '../models/Order/index';
import updateWithdraw from '../helpers/withdraw.helper'; // Adjust path as needed
const Sentry = require('@sentry/node');

jest.mock('@sentry/node');
jest.mock('../models/Order/index');
jest.mock('../utils/constant.util');

describe('updateWithdraw', () => {
   const mockItem = [
      {
         events: [
            { value: 'event123' }, // eventId
            { value: 'userAddress' }, // userAddress
         ],
      },
   ];

   beforeEach(() => {
      // Mock Order.updateMany implementation
      Order.updateMany = jest.fn().mockResolvedValue({ nModified: 1 });
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('should update orders with bidType set to withdraw', async () => {
      const result = await updateWithdraw(mockItem);

      expect(Order.updateMany).toHaveBeenCalledWith(
         { eventId: 'event123', userId: 'userAddress' },
         { bidType: 'withdraw' }
      );
      expect(result).toBeUndefined(); // The function does not return a value
   });

   it('should capture an exception and log an error on failure', async () => {
      const error = new Error('Mocked Error');
      Order.updateMany = jest.fn().mockRejectedValueOnce(error);

      const result = await updateWithdraw(mockItem);

      expect(result).toBeUndefined(); // The function does not return a value
      expect(Sentry.captureException).toHaveBeenCalledWith(error);
      expect(errorLog).toHaveBeenCalledWith(error);
   });

   it('should handle missing userAddress gracefully', async () => {
      const itemWithoutUserAddress = [
         {
            events: [
               { value: 'event123' }, // eventId
               {}, // userAddress is missing
            ],
         },
      ];

      const result = await updateWithdraw(itemWithoutUserAddress);

      expect(Order.updateMany).toHaveBeenCalledWith(
         { eventId: 'event123', userId: undefined },
         { bidType: 'withdraw' }
      );
      expect(result).toBeUndefined(); // The function does not return a value
   });

   it('should handle missing eventId gracefully', async () => {
      const itemWithoutEventId = [
         {
            events: [
               {}, // eventId is missing
               { value: 'userAddress' }, // userAddress
            ],
         },
      ];

      const result = await updateWithdraw(itemWithoutEventId);

      expect(Order.updateMany).toHaveBeenCalledWith(
         { eventId: undefined, userId: 'userAddress' },
         { bidType: 'withdraw' }
      );
      expect(result).toBeUndefined(); // The function does not return a value
   });

   it('should handle missing both eventId and userAddress gracefully', async () => {
      const itemWithoutEventIdAndUserAddress = [
         {
            events: [
               {}, // eventId is missing
               {}, // userAddress is missing
            ],
         },
      ];

      const result = await updateWithdraw(itemWithoutEventIdAndUserAddress);

      expect(Order.updateMany).toHaveBeenCalledWith(
         { eventId: undefined, userId: undefined },
         { bidType: 'withdraw' }
      );
      expect(result).toBeUndefined(); // The function does not return a value
   });
});
