import { errorLog, orderTypes } from '../utils/constant.util';
import Order from '../models/Order/index';
import Events from '../models/Events/index';

const claimWithdraw = async (item: any) => {
   const userAddress = item[0]?.events[1]?.value;
   const eventId = item[0]?.events[0]?.value;
   const reward = item[0]?.events[3]?.value;

   try {
      await Order.updateMany(
         { eventId, userId: userAddress },
         { bidType: 'claimed' }
      );
      await Events.updateOne({ eventId }, { $inc: { reward: reward } });
      console.log('\n');
      console.log('claim updated !');
      console.log('\n');

      // }
   } catch (error) {
      errorLog(error);
   }
};

export default claimWithdraw;
