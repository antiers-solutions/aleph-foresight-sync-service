import { createAndSaveEvent, nullValidation } from '../common/chain.common';
import NftToken from '../worker/nft';
const { Logger } = require('../logger');
class AbiHelper {
   BatchMint = async (
      api: any,
      decoded: any,
      block: any,
      idx: number,
      count: number,
      contractAddress: string
   ) => {
      const arr: any[] = [];
      let values: any = [];
      let transac_Hash: string;
      block.block.header.forEach((ex: any) => {
         arr.push(ex.toHuman());
      });
      const blockNumber = parseInt(arr[1].replace(/,/g, ''), 10);
      decoded.event.args.map(async (item: any, index: any) => {
         if (item.name == 'data') {
            const tokens = decoded?.args[index].toHuman();
            tokens.forEach((data: any) => {
               const from = data.from;
               const to = data.to;
               const tokenId = data.id;
               const value = data?.amount ? data?.amount : null;
               count = count + 1;
               const saveTransaction = new Promise((resolve, reject) => {
                  transac_Hash = nullValidation(
                     block.block.extrinsics[idx].hash
                  );
                  values.push({
                     from: nullValidation(from),
                     to: nullValidation(to),
                     value: value ? value?.toString() : null,
                     txnHash: nullValidation(block.block.extrinsics[idx].hash),
                     block_number: blockNumber,
                     reason: decoded.event.identifier,
                     sectionmethod: `contracts.${decoded.event.identifier}`,
                     status: 'success',
                     count: count,
                     txfee: null,
                     tokenId: tokenId ? Number(`${tokenId}`) : null,
                     contractAddress: contractAddress,
                     createdAt: new Date(),
                     updatedAt: new Date(),
                     timestamp: `${new Date().getTime()}`,
                  });
                  // const transac = new Transaction({
                  //    from: nullValidation(from),
                  //    to: nullValidation(to),
                  //    value: value ? value?.toString() : null,
                  //    txnHash: nullValidation(block.block.extrinsics[idx].hash),
                  //    block_number: blockNumber,
                  //    reason: decoded.event.identifier,
                  //    sectionmethod: `contracts.${decoded.event.identifier}`,
                  //    status: 'success',
                  //    count: count,
                  //    txfee: null,
                  //    tokenId: tokenId ? Number(`${tokenId}`) : null,
                  //    contractAddress: contractAddress,
                  //    createdAt: new Date(),
                  //    updatedAt: new Date(),
                  //    timestamp: `${new Date().getTime()}`,
                  // });
                  const eventsDataProps: any = {
                     from: nullValidation(from),
                     to: nullValidation(to),
                     value: value ? value?.toString() : null,
                     txnHash: nullValidation(block.block.extrinsics[idx].hash),
                     reason: decoded.event.identifier,
                     sectionmethod: `contracts.${decoded.event.identifier}`,
                     txfee: null,
                     tokenId: tokenId ? Number(`${tokenId}`) : null,
                     contractAddress: contractAddress,
                     timestamp: `${new Date().getTime()}`,
                  };

                  createAndSaveEvent(eventsDataProps)
                     .then(() => {
                        Logger.info('Events data saved');
                     })
                     .catch((err) => {
                        Logger.error('Error events: ' + err);
                     });
               });

               saveTransaction
                  .then(async (result) => {
                     if (result) {
                        NftToken.Nft(await api, null, contractAddress);
                        return count;
                     }
                  })
                  .catch((error) => {
                     Logger.error('Error saving transaction: ' + error);
                  });
            });
         }
      });

      return count;
   };
}

export default new AbiHelper();
