const cron = require('node-cron');
const Web3 = require('web3');
import saveEvent from '../helpers/event.helper';
import ContractAbi from '../contracts/contract.abi';
import saveOrder from '../helpers/order.helper';
const abidecoder = require('abi-decoder');
const web3 = new Web3(process.env.SOCKET_HOST);
class Worker {
   public connection: any;
   async Native(api: any) {
      cron.schedule('*/6 * * * * *', async () => {
         try {
            const metadata = await api.rpc.state.getMetadata();
            await api.registry.setMetadata(metadata);
            const blockHeader = await api.rpc.chain.getHeader();
            const blockNumber = await blockHeader.number.toNumber();
            console.log('blockNumber ========>>>>', blockNumber);

            for (let index = blockNumber; index <= blockNumber; index++) {
               const blockHash = await api.rpc.chain.getBlockHash(index);
               const block = await api.rpc.chain.getBlock(blockHash);
               let events = 0;
               const arr: any[] = [];
               block.block.header.forEach((ex: any) => {
                  arr.push(ex.toHuman());
               });
               const allRecords = await api?.query?.system?.events?.at(
                  block?.block?.header?.hash
               );
               let totalTransactionSize = 0;
               block?.block?.extrinsics?.forEach(
                  (
                     { method: { event, section } }: any,
                     index: any,
                     extrinsic: any
                  ) => {
                     totalTransactionSize = extrinsic.encodedLength;
                     allRecords
                        .filter(
                           ({ phase }: any) =>
                              phase.isApplyExtrinsic &&
                              phase.asApplyExtrinsic.eq(index)
                        )
                        .map(async ({ event }: any) => {
                           events = events + 1;
                           console.log(
                              'event ============>>>>',
                              event.toHuman().method
                           );
                           if (
                              (event.toHuman().section == 'evm' ||
                                 event.toHuman().section == 'ethereum') &&
                              (event.toHuman().method == 'Executed' ||
                                 event.toHuman().method == 'Log')
                           ) {
                              console.log(
                                 'event?.data?.transactionHash ',
                                 String(event?.data?.transactionHash)
                              );
                              console.log(
                                 'event?.data?.transactionHash ',
                                 event?.data?.toHuman()
                              );
                              if (event?.data?.transactionHash) {
                                 // const txData =
                                 //    await this.connection?.eth?.getTransaction(
                                 //       event?.data?.transactionHash
                                 //    );
                                 const xxxxxxxx =
                                    await web3.eth.getTransactionReceipt(
                                       event?.data?.transactionHash
                                    );
                                 abidecoder.addABI(ContractAbi);
                                 const item = abidecoder.decodeLogs(
                                    xxxxxxxx?.logs
                                 );

                                 console.log(
                                    'item[0]?.events[1]?.name : ',
                                    item
                                 );

                                 if (item[0]?.name == 'event_info') {
                                    saveEvent(
                                       item,
                                       event?.data?.transactionHash
                                    );
                                 }

                                 if (item[0]?.name == 'response_info') {
                                    saveOrder(
                                       item,
                                       event?.data?.transactionHash
                                    );
                                 }
                              }
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
