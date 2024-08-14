import { errorLog, orderTypes } from '../utils/constant.util';
import Order from '../models/Order/index';
import updateOrder from '../helpers/result.helper'; // Adjust path as needed
const Sentry = require('@sentry/node');

jest.mock('@sentry/node');
jest.mock('../models/Order/index');
jest.mock('../utils/constant.util');

describe('updateOrder', () => {
   const mockItem = [
      {
         events: [
            { value: 'event123' }, // eventId
            { value: orderTypes.yes }, // bidType
         ],
      },
   ];

   beforeEach(() => {
      // Mock Order.updateMany implementation
      Order.updateMany = jest.fn().mockResolvedValue({ nModified: 2 });
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('should update orders with correct result values', async () => {
      await updateOrder(mockItem);

      // Verify that updateMany is called with correct parameters
      expect(Order.updateMany).toHaveBeenCalledWith(
         { eventId: 'event123', bidType: 'true' },
         { result: 1 }
      );
      expect(Order.updateMany).toHaveBeenCalledWith(
         { eventId: 'event123', bidType: 'false' },
         { result: 0 }
      );
   });

   it('should capture an exception and log an error on failure', async () => {
      const error = new Error('Mocked Error');
      Order.updateMany = jest.fn().mockRejectedValueOnce(error);

      await updateOrder(mockItem);

      expect(Sentry.captureException).toHaveBeenCalledWith(error);
      expect(errorLog).toHaveBeenCalledWith(error);
   });

   it('should handle missing eventId gracefully', async () => {
      const itemWithoutEventId = [
         {
            events: [
               { value: '' }, // eventId is empty
               { value: orderTypes.yes }, // bidType
            ],
         },
      ];

      await updateOrder(itemWithoutEventId);

      // Verify that updateMany is called with empty eventId
      expect(Order.updateMany).toHaveBeenCalledWith(
         { eventId: '', bidType: 'true' },
         { result: 1 }
      );
      expect(Order.updateMany).toHaveBeenCalledWith(
         { eventId: '', bidType: 'false' },
         { result: 0 }
      );
   });
});
