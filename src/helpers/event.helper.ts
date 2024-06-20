import Events from '../models/Events/index';
import timeStampToString from '../helpers/commom.helper';
const axios = require('axios');

const saveEvent = async (item: any, txnHash: string) => {
   try {
      const fetchData = await axios.get(item[0]?.events[0]?.value);

      console.log(timeStampToString(Number(item[0]?.events[3]?.value)));

      console.log(
         'the new data ',
         timeStampToString(Number(item[0]?.events[3]?.value * 1000))
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
         resolutionSource: 'https://coinmarketcap.com/currencies/ethereum/',
         resolver: 'resolver123',
         status: true,
         eventExpireTime: timeStampToString(
            Number(item[0]?.events[3]?.value * 1000)
         ),
      };

      const event = new Events(data);
      return await event.save();
   } catch (error: any) {
      console.log('error while saveing in the events : ', error);
      return error;
   }
};

export default saveEvent;
