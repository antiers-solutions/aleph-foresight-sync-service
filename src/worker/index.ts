const cron = require('node-cron');
const Web3 = require('web3');
import ContractAbi from '../contracts/contract.abi';
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
                  (index: any, extrinsic: any) => {
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
                              event.toHuman()
                           );
                           if (
                              (event.toHuman().section == 'evm' ||
                                 event.toHuman().section == 'ethereum') &&
                              (event.toHuman().method == 'Executed' ||
                                 event.toHuman().method == 'Log')
                           ) {
                              const txData =
                                 await this.connection?.eth?.getTransaction(
                                    event?.data?.transactionHash
                                 );
                              const xxxxxxxx =
                                 await web3.eth.getTransactionReceipt(
                                    event?.data?.transactionHash
                                 );
                              console.log(
                                 'with events : ',
                                 xxxxxxxx.logs[0]?.data
                              );
                              abidecoder.addABI(ContractAbi);
                              const item = abidecoder.decodeLogs(
                                 xxxxxxxx?.logs
                              );
                              console.log('yyyyyy : ', item[0]?.events[0]);
                              console.log('yyyyyy : ', item[0]?.events[1]);
                              console.log('yyyyyy : ', item[0]?.events[2]);
                              console.log('yyyyyy : ', item[0]?.events[3]);
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
