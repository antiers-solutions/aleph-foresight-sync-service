import * as Sentry from '@sentry/node';
import { errorLog, orderTypes } from '../utils/constant.util';
import Order from '../models/Order/index';
import Events from '../models/Events/index';

const claimReward = async (item: any) => {
   const userAddress = item[0]?.events[1]?.value;
   const eventId = item[0]?.events[0]?.value;
   const amountClaimed = item[0]?.events[2]?.value;
   const reward = item[0]?.events[3]?.value;
   const result = item[0]?.events[4]?.value == 'Yes' ? 'true' : 'false';

   try {
      await Order.updateMany(
         { eventId, userId: userAddress, bidType: result },
         { bidType: 'claimed', amountClaimed }
      );
      await Events.updateOne({ eventId }, { $inc: { reward: reward } });
      console.info(
         '\x1b[36m claimReward has been updated : ',
         eventId,
         userAddress
      );
   } catch (error) {
      Sentry.captureException(error);
      errorLog(error);
   }
};

export default claimReward;
