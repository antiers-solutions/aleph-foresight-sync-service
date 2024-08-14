import { errorLog, orderTypes } from '../utils/constant.util';
import Order from '../models/Order/index';
import * as Sentry from '@sentry/node';

const updateOrder = async (item: any) => {
   const eventId = item[0]?.events[0]?.value;
   const bidType = item[0]?.events[1]?.value == orderTypes.yes ? true : false;
   try {
      await Order.updateMany(
         { eventId, bidType: String(bidType) },
         { result: 1 }
      );
      await Order.updateMany(
         { eventId, bidType: String(!bidType) },
         { result: 0 }
      );

      console.info('\x1b[36m orders has been updated : ', eventId, bidType);
   } catch (error) {
      Sentry.captureException(error);
      errorLog(error);
   }
};

export default updateOrder;
