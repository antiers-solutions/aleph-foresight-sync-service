const Sentry = require('@sentry/node');
import { errorLog } from '../utils/constant.util';
import Order from '../models/Order/index';
import Events from '../models/Events/index';
import claimReward from '../helpers/claim.helper';

jest.mock('@sentry/node');
jest.mock('../utils/constant.util', () => ({
   errorLog: jest.fn(),
}));
jest.mock('../models/Order/index');
jest.mock('../models/Events/index');

describe('claimReward', () => {
   const mockItem = [
      {
         events: [
            { value: 'event1' }, // eventId
            { value: 'user1' }, // userAddress
            { value: 100 }, // amountClaimed
            { value: 50 }, // reward
            { value: 'Yes' }, // result
         ],
      },
   ];

   beforeEach(() => {
      jest.clearAllMocks();
      jest.setTimeout(10000); // Increase timeout for long-running tests
   });

   it('should update Order and Events when claim is successful', async () => {
      // Mocking successful saves
      (Order.updateMany as jest.Mock).mockResolvedValue({});
      (Events.updateOne as jest.Mock).mockResolvedValue({});

      await claimReward(mockItem);

      expect(Order.updateMany).toHaveBeenCalledWith(
         { eventId: 'event1', userId: 'user1', bidType: 'true' },
         { bidType: 'claimed', amountClaimed: 100 }
      );

      expect(Events.updateOne).toHaveBeenCalledWith(
         { eventId: 'event1' },
         { $inc: { reward: 50 } }
      );

      expect(Sentry.captureException).not.toHaveBeenCalled();
      expect(errorLog).not.toHaveBeenCalled();
   });

   it('should log an error and capture exception when Order update fails', async () => {
      (Order.updateMany as jest.Mock).mockRejectedValue(
         new Error('Order update failed')
      );

      await claimReward(mockItem);

      expect(Sentry.captureException).toHaveBeenCalledWith(expect.any(Error));
      expect(errorLog).toHaveBeenCalledWith(expect.any(Error));
   });

   it('should log an error and capture exception when Events update fails', async () => {
      (Events.updateOne as jest.Mock).mockRejectedValue(
         new Error('Events update failed')
      );

      await claimReward(mockItem);

      expect(Sentry.captureException).toHaveBeenCalledWith(expect.any(Error));
      expect(errorLog).toHaveBeenCalledWith(expect.any(Error));
   });

   // Uncomment and modify this test case as needed
   // it('should handle case when result is "No"', async () => {
   //   const mockItemNoResult = [
   //     {
   //       events: [
   //         { value: 'event1' },
   //         { value: 'user1' },
   //         { value: 100 },
   //         { value: 50 },
   //         { value: 'No' },
   //       ],
   //     },
   //   ];

   //   await claimReward(mockItemNoResult);

   //   expect(Order.updateMany).toHaveBeenCalledWith(
   //     { eventId: 'event1', userId: 'user1', bidType: 'false' },
   //     { bidType: 'claimed', amountClaimed: 100 }
   //   );

   //   expect(Events.updateOne).toHaveBeenCalledWith(
   //     { eventId: 'event1' },
   //     { $inc: { reward: 50 } }
   //   );
   // });
});
