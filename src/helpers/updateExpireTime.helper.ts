import * as Sentry from '@sentry/node';
import Events from '../models/Events/index';
import timeStampToString from '../helpers/commom.helper';

const saveUpdateExpTime = async (item: any) => {
   try {
      console.log('i am here');
      const result = await Events.updateOne(
         { eventId: item[0]?.events[0]?.value },
         {
            targetDateTime: item[0]?.events[2]?.value,
            bettingClosureTime: item[0]?.events[3]?.value,
            eventExpireTime: timeStampToString(
               Number(item[0]?.events[2]?.value * 1000)
            ),
            betExpireTime: timeStampToString(
               Number(item[0]?.events[3]?.value * 1000)
            ),
         }
      );
      console.log('resultData : ', result);
      return result;
   } catch (error: any) {
      Sentry.captureException(error);
      return error;
   }
};

export default saveUpdateExpTime;
