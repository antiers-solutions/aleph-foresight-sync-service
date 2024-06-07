
import BlockHelper from '../helpers/block.helper';
import TransactionHelper from '../helpers/transaction.helper';
const cron = require('node-cron');
const { evmEvent } = require('../events/evm');

class Worker {
   async Native(api: any) {
      const lastCount = await TransactionHelper.getLastSavedTransacdb();
      cron.schedule('*/6 * * * * *', async () => {
         try {
            const metadata = await api.rpc.state.getMetadata();
            await api.registry.setMetadata(metadata);
            const blockHeader = await api.rpc.chain.getHeader();
            const blockNumber = await blockHeader.number.toNumber();
            // const lastBlock = await BlockHelper.getLastSavedBlockdb(
            //    Block,
            //    blockNumber
            // );
            const count = await TransactionHelper.getLastSavedTransacdb();
            let T_count = count > lastCount ? count : lastCount;
            for (let index = lastBlock + 1; index <= blockNumber; index++) {
               console.log(T_count + ' Transactions');
               const blockHash = await api.rpc.chain.getBlockHash(index);
               const block = await api.rpc.chain.getBlock(blockHash);
               let transactionCount = 0;
               let events = 0;
               const arr: any[] = [];
               block.block.header.forEach((ex: any) => {
                  arr.push(ex.toHuman());
               });
               const block_number = JSON.parse(block?.block?.header?.number);
               const allRecords = await api?.query?.system?.events?.at(
                  block?.block?.header?.hash
               );
               let totalTransactionSize = 0;
               block?.block?.extrinsics?.forEach(
                  (
                     { method: { method, section } }: any,
                     index: any,
                     extrinsic: any
                  ) => {
                     let isEvm = false;
                     totalTransactionSize = extrinsic.encodedLength;
                     allRecords
                        .filter(
                           ({ phase }: any) =>
                              phase.isApplyExtrinsic &&
                              phase.asApplyExtrinsic.eq(index)
                        )
                        .map(async ({ event }: any) => {
                           events = events + 1;

                           if (
                              ((section == 'evm' || section == 'ethereum') &&
                                 !isEvm &&
                                 method == 'transact') ||
                              event.toHuman().method == 'Log'
                           ) {
                              isEvm = true;
                              transactionCount += await evmEvent(
                                 section,
                                 method,
                                 block_number,
                                 T_count,
                                 allRecords,
                                 index
                              );
                           }
                        });
                  }
               );
            }
         } catch (error) {
            return error;
         }
      });
   }
}
export default new Worker();
