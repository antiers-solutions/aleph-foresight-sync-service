import Events from '../models/Events/index';
const axios = require('axios');
const saveEvent = async (item: any, txnHash: string) => {
   try {
      const fetchData = await axios.get(item[0]?.events[0]?.value);
      console.log('the new data ', fetchData);

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
         resolutionSource: 'Official Source',
         resolver: 'resolver123',
         status: true,
      };
      console.log('=======> : ', data);

      const event = new Events(data);
      const saved = await event.save();
      console.log('====<><><><><><===> : ', saved);
   } catch (error: any) {
      console.log('error while saveing in the events : ', error);
   }
};

export default saveEvent;
