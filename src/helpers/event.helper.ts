import Events from '../models/Events/index';
import timeStampToString from '../helpers/commom.helper';
import { resolutionSource } from '../utils/constant.util';
const axios = require('axios');

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
            Number(item[0]?.events[3]?.value * 1000) + 60
         ),
      };
      const event = new Events(data);
      console.log('\n');
      console.log('event saved');
      console.log('\n');
      const resultData = await event.save();

      console.log('++++++++++++++++++++++');
      console.log('++++++++++++++++++++++');

      console.log(resultData);

      console.log('++++++++++++++++++++++');
      console.log('++++++++++++++++++++++');

      return resultData;
   } catch (error: any) {
      return error;
   }
};

export default saveEvent;
