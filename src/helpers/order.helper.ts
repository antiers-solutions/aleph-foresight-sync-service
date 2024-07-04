import { errorLog, orderTypes } from '../utils/constant.util';
import Order from '../models/Order/index';

const saveOrder = async (item: any, txnHash: string) => {
   const bidType = item[0]?.events[2]?.value == orderTypes.yes ? true : false;
   const orderType = item[0]?.events[2]?.value == orderTypes.yes ? true : false;
   try {
      const data = {
         bidType,
         eventId: String(item[0]?.events[0]?.value),
         userId: String(item[0]?.events[1]?.value),
         txnId: String(txnHash),
         amount: item[0]?.events[3]?.value,
         currentBet: item[0]?.events[4]?.value,
         fees: 5,
         orderType,
      };

      const order = new Order(data);
      await order.save();

      console.log('\n');
      console.log('order saved !');
      console.log('\n');
   } catch (error) {
      errorLog(error);
   }
};

export default saveOrder;
