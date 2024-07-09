import { errorLog, orderTypes } from '../utils/constant.util';
import Order from '../models/Order/index';
import * as Sentry from '@sentry/node';

const updateOrder = async (item: any) => {
   const eventId = item[0]?.events[0]?.value;
   const bidType =
      item[0]?.events[1]?.value == orderTypes.yes ? 'true' : 'false';
   try {
      await Order.updateMany({ eventId, bidType }, { result: 1 });
      console.log('\n');
      console.log('order updated !');
      console.log('\n');
   } catch (error) {
      Sentry.captureException(error);
      errorLog(error);
   }
};

export default updateOrder;
