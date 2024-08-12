const Sentry = require('@sentry/node');
import Events from '../models/Events/index';
import saveUpdateExpTime from '../helpers/updateExpireTime.helper'; // Adjust path as needed
import timeStampToString from '../helpers/commom.helper'; // Import the helper function

jest.mock('@sentry/node');
jest.mock('../models/Events/index');
jest.mock('../helpers/commom.helper', () => ({
   // Mock timeStampToString function
   __esModule: true,
   default: jest.fn(),
}));

describe('saveUpdateExpTime', () => {
   const mockItem = [
      {
         events: [
            { value: 'event123' }, // eventId
            {}, // Placeholder for other event data
            { value: 1650000000 }, // targetDateTime (timestamp)
            { value: 1650000000 }, // bettingClosureTime (timestamp)
            { value: 70000000 }, // priceLevel (multiplied by 10^7)
         ],
      },
   ];

   beforeEach(() => {
      jest.clearAllMocks();
      (timeStampToString as jest.Mock).mockImplementation((timestamp: number) =>
         new Date(timestamp).toISOString()
      );
      Events.updateOne = jest.fn().mockResolvedValue({ nModified: 1 });
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('should update event fields successfully', async () => {
      const result = await saveUpdateExpTime(mockItem);

      expect(Events.updateOne).toHaveBeenCalledWith(
         { eventId: 'event123' },
         {
            targetDateTime: 1650000000,
            bettingClosureTime: 1650000000,
            eventExpireTime: timeStampToString(1650000000 * 1000),
            betExpireTime: timeStampToString(1650000000 * 1000),
            priceLevel: 7, // 70000000 / 10^7
         }
      );
      expect(result).toEqual({ nModified: 1 });
   });

   it('should capture an exception and return the error on failure', async () => {
      const error = new Error('Mocked Error');
      Events.updateOne = jest.fn().mockRejectedValueOnce(error);

      const result = await saveUpdateExpTime(mockItem);

      expect(result).toBe(error);
      expect(Sentry.captureException).toHaveBeenCalledWith(error);
   });

   it('should handle missing eventId gracefully', async () => {
      const itemWithoutEventId = [
         {
            events: [
               { value: '' }, // eventId is empty
               {}, // Placeholder for other event data
               { value: 1650000000 }, // targetDateTime (timestamp)
               { value: 1650000000 }, // bettingClosureTime (timestamp)
               { value: 70000000 }, // priceLevel
            ],
         },
      ];

      const result = await saveUpdateExpTime(itemWithoutEventId);

      expect(Events.updateOne).toHaveBeenCalledWith(
         { eventId: '' },
         {
            targetDateTime: 1650000000,
            bettingClosureTime: 1650000000,
            eventExpireTime: timeStampToString(1650000000 * 1000),
            betExpireTime: timeStampToString(1650000000 * 1000),
            priceLevel: 7, // 70000000 / 10^7
         }
      );
      expect(result).toEqual({ nModified: 1 });
   });
});
