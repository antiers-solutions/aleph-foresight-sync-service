import { errorLog } from '../utils/constant.util';
import * as Sentry from '@sentry/node';

import Order from '../models/Order/index';

const updateWithdraw = async (item: any) => {
   const userAddress = item[0]?.events[1]?.value;
   const eventId = item[0]?.events[0]?.value;

   try {
      await Order.updateMany(
         { eventId, userId: userAddress },
         { bidType: 'withdraw' }
      );
   } catch (error) {
      Sentry.captureException(error);
      errorLog(error);
   }
};

export default updateWithdraw;
