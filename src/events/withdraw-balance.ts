import { nullValidation } from '../common/chain.common';

exports.withdrawEvent = async (
   event: any,
   block: any,
   index: any,
   temptransactionstatmin: any,
   temptransactionstathour: any,
   transactionCount: any,
   transactions: any,
   savetransaction: any,
   section: any,
   method: any
) => {
   const data = JSON.parse(block.block.extrinsics[index].toString());
   const from = data?.signature?.signer?.id.toString();
   const to = data?.method?.args?.dest?.id?.toString();
   const value: any = (
      Number(data?.method?.args?.value) / Math.pow(10, 18)
   ).toString();
   transactions[`${block.block.extrinsics[index].hash}`] = {};
   transactions[`${block.block.extrinsics[index].hash}`].txFee =
      Number(event.data[1]) / Math.pow(10, 18);
   if (from === to) {
      temptransactionstatmin['count'] = temptransactionstatmin['count'] + 1;
      temptransactionstathour['count'] = temptransactionstathour['count'] + 1;
      transactionCount = transactionCount + 1;
      savetransaction.push({
         from: nullValidation(from),
         to: nullValidation(to),
         value: nullValidation(value),
         txnHash: nullValidation(block.block.extrinsics[index].hash),
         block_number: index,
         reason: null,
         sectionmethod: `${section}.${method}`,
         status: 'success',
         count: 0,
         txfee: nullValidation(
            transactions[`${block.block.extrinsics[index].hash}`].txFee
         ),
         createdAt: new Date(),
         updatedAt: new Date(),
         timestamp: `${new Date().getTime()}`,
      });
   }
};
