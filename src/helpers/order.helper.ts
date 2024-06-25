import Order from '../models/Order/index';
const saveOrder = async (item: any, txnHash: string) => {
   try {
      const data = {
         eventId: String(item[0]?.events[0]?.value),
         userId: String(item[0]?.events[1]?.value),
         txnId: String(txnHash),
         amount: item[0]?.events[3]?.value,
         fees: 5,
         orderType: item[0]?.events[2]?.value == 'Yes' ? true : false,
      };
      const order = new Order(data);

      await order.save();
   } catch (error) {
      console.log('error : ', error);
   }
};

export default saveOrder;
