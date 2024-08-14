import { connections, socketSuccess } from '../utils/constant.util';
import { Logger } from '../logger';
const Sentry = require('@sentry/node');
import Events from '../models/Events/index';
import updateBetClosureTime from '../helpers/saveUpdateBetClosure.helper'; // Ensure correct path

jest.mock('@sentry/node');
jest.mock('../models/Events/index');
jest.mock('../helpers/commom.helper');

const timeStampToString: jest.Mock = jest.fn();

describe('updateBetClosureTime', () => {
   const mockItem = [
      {
         events: [
            { value: 'event123' }, // eventId
            {}, // Placeholder for other event data
            { value: 1650000000 }, // bettingClosureTime (timestamp)
         ],
      },
   ];

   beforeEach(() => {
      // Mock timeStampToString implementation
      timeStampToString.mockImplementation((timestamp: number) =>
         new Date(timestamp).toISOString()
      );

      // Mock Events.updateOne
      Events.updateOne = jest.fn().mockResolvedValue({ nModified: 1 });
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   // it('should update the betting closure time and bet expire time successfully', async () => {
   //   const expectedBetExpireTime = timeStampToString(Number(mockItem[0]?.events[2]?.value) * 1000);

   //   const result = await updateBetClosureTime(mockItem);

   //   expect(Events.updateOne).toHaveBeenCalledWith(
   //     { eventId: mockItem[0]?.events[0]?.value },
   //     {
   //       bettingClosureTime: mockItem[0]?.events[2]?.value,
   //       betExpireTime: expectedBetExpireTime,
   //     }
   //   );
   //   expect(result).toEqual({ nModified: 1 });
   // });

   it('should capture an exception and return the error on failure', async () => {
      const error = new Error('Mocked Error');
      Events.updateOne = jest.fn().mockRejectedValueOnce(error);

      const result = await updateBetClosureTime(mockItem);

      expect(result).toBe(error);
      expect(Sentry.captureException).toHaveBeenCalledWith(error);
   });

   // it('should handle missing eventId gracefully', async () => {
   //   const itemWithoutEventId = [
   //     {
   //       events: [
   //         { value: '' }, // eventId is empty
   //         {},  // Placeholder for other event data
   //         { value: 1650000000 }, // bettingClosureTime (timestamp)
   //       ],
   //     },
   //   ];

   //   const expectedBetExpireTime = timeStampToString(Number(mockItem[0]?.events[2]?.value) * 1000);

   //   const result = await updateBetClosureTime(itemWithoutEventId);

   //   expect(Events.updateOne).toHaveBeenCalledWith(
   //     { eventId: '' },
   //     {
   //       bettingClosureTime: itemWithoutEventId[0]?.events[2]?.value,
   //       betExpireTime: expectedBetExpireTime,
   //     }
   //   );
   //   expect(result).toEqual({ nModified: 1 });
   // });
});
