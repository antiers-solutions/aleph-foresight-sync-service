import * as Sentry from '@sentry/node';
const axios = require('axios');
import Events from '../models/Events/index';
import timeStampToString from '../helpers/commom.helper';
import { resolutionSource } from '../utils/constant.util';

const saveEvent = async (item: any, txnHash: string) => {
   try {
      const fetchData = await axios.get(
         process.env.IPFSURL + item[0]?.events[0]?.value
      );
      const data = {
         eventId: String(item[0]?.events[0]?.value),
         userId: String(item[0]?.events[1]?.value),
         txnId: String(txnHash),
         priceLevel: fetchData?.data?.price,
         currencyType: String(fetchData?.data?.name),
         description: String(fetchData?.data?.description),
         targetDateTime: String(item[0]?.events[3]?.value),
         bettingClosureTime: String(item[0]?.events[4]?.value),
         eventDuration: String(item[0]?.events[2]?.value),
         platformFees: 5,
         minimumBetFees: 10,
         maximumBetFees: 50000,
         resolutionSource: resolutionSource,
         resolver: 'resolver123',
         status: 1,
         eventExpireTime: timeStampToString(
            Number(item[0]?.events[3]?.value * 1000)
         ),
         betExpireTime: timeStampToString(
            Number(item[0]?.events[4]?.value * 1000)
         ),
      };
      const event = new Events(data);
      const resultData = await event.save();
      console.info(
         '\x1b[36m event has been saved : ',
         String(item[0]?.events[0]?.value)
      );

      return resultData;
   } catch (error: any) {
      Sentry.captureException(error);
      return error;
   }
};

export default saveEvent;
