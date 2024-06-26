import { errorLog, orderTypes } from '../utils/constant.util';
import Order from '../models/Order/index';

const saveOrder = async (item: any, txnHash: string) => {
   const userAddress = item[0]?.events[1]?.value;
   const eventId = item[0]?.events[0]?.value;
   const orderType = item[0]?.events[2]?.value == orderTypes.yes ? true : false;
   const query = { eventId, userId: userAddress, orderType: orderType };
   const existingOrders = await Order.findOne(query).exec();
   try {
      if (existingOrders) {
         const updateData = {
            txnId: String(txnHash),
            amount: item[0]?.events[3]?.value,
         };
         await Order.findOneAndUpdate(query, updateData);
      } else {
         const data = {
            eventId: String(item[0]?.events[0]?.value),
            userId: String(item[0]?.events[1]?.value),
            txnId: String(txnHash),
            amount: item[0]?.events[3]?.value,
            fees: 5,
            orderType:
               item[0]?.events[2]?.value == orderTypes.yes ? true : false,
         };
         const order = new Order(data);
         await order.save();
      }
   } catch (error) {
      errorLog(error);
   }
};

export default saveOrder;
