import { errorLog, orderTypes } from '../utils/constant.util';
import * as Sentry from '@sentry/node';

import Order from '../models/Order/index';
import Events from '../models/Events/index';

const updateWithdraw = async (item: any) => {
   const userAddress = item[0]?.events[1]?.value;
   const eventId = item[0]?.events[0]?.value;
   const reward = item[0]?.events[3]?.value;

   try {
      await Order.updateMany(
         { eventId, userId: userAddress },
         { bidType: 'withdraw' }
      );
      await Events.updateOne({ eventId }, { $inc: { reward: reward } });
   } catch (error) {
      Sentry.captureException(error);
      errorLog(error);
   }
};

export default updateWithdraw;
