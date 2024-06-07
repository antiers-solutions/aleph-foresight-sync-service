import { nullValidation } from '../common/chain.common';

exports.failedEvent = async (
   event: any,
   block: any,
   index: any,
   api: any,
   transactions: any,
   section: any,
   method: any
) => {
   const [dispatchError] = event.data;
   let errorInfo;
   if (dispatchError.isModule) {
      const decoded = api.registry.findMetaError(dispatchError.asModule);
      errorInfo = `${decoded.section}.${decoded.name}`;
   } else {
      errorInfo = dispatchError.toString();
   }
   let temptransaction: any = [];
   const data = JSON.parse(block.block.extrinsics[index]);

   const from = data?.signature?.signer?.id;
   const to = data?.method?.args?.dest?.id;
   const value = Number(data?.method?.args?.value) / Math.pow(10, 18);
   const txFee = transactions[`${block.block.extrinsics[index].hash}`]?.txFee
      ? transactions[`${block.block.extrinsics[index].hash}`].txFee
      : 0;
   temptransaction = `${temptransaction}(UUID_TO_BIN(UUID()),'${from}','${to}','${value}','${
      block.block.extrinsics[index].hash
   }','${index}',now(),now(),'${errorInfo}','${section}.${method}','failed','${txFee}','${
      data?.method?.args?.memo ? data?.method?.args?.memo : null
   }
                             ','null','null'`;
   transactions[`${block.block.extrinsics[index].hash}`] = temptransaction;
   return {
      Tdata: {
         from: nullValidation(from),
         to: nullValidation(to),
         value: nullValidation(value),
         txnHash: nullValidation(block.block.extrinsics[index].hash),
         block_number: index,
         reason: errorInfo,
         sectionmethod: `${section}.${method}`,
         status: 'failed',
         txfee: nullValidation(txFee),
         count: 0,
         createdAt: new Date(),
         updatedAt: new Date(),
         timestamp: `${new Date().getTime()}`,
         memo: data?.method?.args?.memo ? data?.method?.args?.memo : null,
      },
      temptransaction: temptransaction,
   };
};
