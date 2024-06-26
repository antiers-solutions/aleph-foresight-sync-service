import { errorLog, orderTypes } from '../utils/constant.util';
import Order from '../models/Order/index';
const saveOrder = async (item: any, txnHash: string) => {
   try {
      const data = {
         eventId: String(item[0]?.events[0]?.value),
         userId: String(item[0]?.events[1]?.value),
         txnId: String(txnHash),
         amount: item[0]?.events[3]?.value,
         fees: 5,
         orderType: item[0]?.events[2]?.value == orderTypes.yes ? true : false,
      };
      const order = new Order(data);

      await order.save();
   } catch (error) {
      errorLog(error);
   }
};

export default saveOrder;
