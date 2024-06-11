import Order from '../models/Order/index';
const web3 = require('web3');
const saveOrder = async (item: any, txnHash: string) => {
   try {
      const data = {
         eventId: String(item[0]?.events[0]?.value),
         txnId: String(txnHash),
         amount: await web3.utils.fromWei(
            String(item[0]?.events[3]?.value),
            'ether'
         ),
         fees: 5,
         orderType: item[0]?.events[2]?.value == 'Yes' ? true : false,
      };

      const order = new Order(data);

      const savedOrder = await order.save();
      console.log('savedOrder : ', savedOrder);
   } catch (error) {
      console.log('error : ', error);
   }
};

export default saveOrder;
