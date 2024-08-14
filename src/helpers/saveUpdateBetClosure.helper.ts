import * as Sentry from '@sentry/node';
import Events from '../models/Events/index';
import timeStampToString from '../helpers/commom.helper';

const updateBetClosureTime = async (item: any) => {
   try {
      const result = await Events.updateOne(
         { eventId: item[0]?.events[0]?.value },
         {
            bettingClosureTime: item[0]?.events[2]?.value,
            betExpireTime: timeStampToString(
               Number(item[0]?.events[2]?.value * 1000)
            ),
         }
      );

      console.info(
         '\x1b[36m BetClosureTime has been updated : ',
         item[0]?.events[0]?.value,
         item[0]?.events[2]?.value
      );

      return result;
   } catch (error: any) {
      Sentry.captureException(error);
      return error;
   }
};

export default updateBetClosureTime;
