const cron = require('node-cron');
const Web3 = require('web3');
import axios from 'axios';
const abidecoder = require('abi-decoder');
import '../connection';
import saveEvent from '../helpers/event.helper';
import * as Producer from '../repanda/producer';
import ContractAbi from '../contracts/contract.abi';
import saveOrder from '../helpers/order.helper';
import Events from '../models/Events/index';
import timeStampToString from '../helpers/commom.helper';
import Currency from '../models/Currency/index';
import { chain, kafka, priceListUrl } from '../utils/constant.util';
import { LogsMap, LogsStructure } from '../interfaces/worker.interfaces';
import Block from '../models/Block';
import updateWithdraw from '../helpers/withdraw.helper';
import claimWithdraw from '../helpers/claim.helper';
const web3 = new Web3(process.env.SOCKET_HOST);

// const contract = new web3.eth.Contract(
//    ContractAbi,
//    process.env.CONTRACT_ADDRESS
// );

// const account = web3.eth.accounts.wallet.add(process.env.ADMIN).get(0);

class Worker {
   public connection: any;

   // async Native(api: any) {
   //    cron.schedule('*/6 * * * * *', async () => {
   //       try {
   //          const metadata = await api.rpc.state.getMetadata();
   //          await api.registry.setMetadata(metadata);
   //          const blockHeader = await api.rpc.chain.getHeader();
   //          const blockNumber = await blockHeader.number.toNumber();
   //          console.log('blockNumber == > ', blockNumber);

   //          for (let index = blockNumber; index <= blockNumber; index++) {
   //             const blockHash = await api.rpc.chain.getBlockHash(index);
   //             const block = await api.rpc.chain.getBlock(blockHash);
   //             let events = 0;
   //             const arr: LogsStructure[] = [];
   //             block.block.header.forEach((logs: any) => {
   //                arr.push(logs.toHuman());
   //             });
   //             const allRecords = await api?.query?.system?.events?.at(
   //                block?.block?.header?.hash
   //             );
   //             let totalTransactionSize = 0;
   //             block?.block?.extrinsics?.forEach(
   //                (
   //                   { method: { event, section } }: any,
   //                   index: any,
   //                   extrinsic: any
   //                ) => {
   //                   totalTransactionSize = extrinsic.encodedLength;
   //                   allRecords
   //                      .filter(
   //                         ({ phase }: any) =>
   //                            phase.isApplyExtrinsic &&
   //                            phase.asApplyExtrinsic.eq(index)
   //                      )
   //                      .map(async ({ event }: any) => {
   //                         events = events + 1;
   //                         if (
   //                            (event.toHuman().section == chain.evm ||
   //                               event.toHuman().section == chain.ethereum) &&
   //                            (event.toHuman().method == chain.executed ||
   //                               event.toHuman().method == chain.log)
   //                         ) {
   //                            if (event?.data?.transactionHash) {
   //                               const transactionReceipt =
   //                                  await web3.eth.getTransactionReceipt(
   //                                     event?.data?.transactionHash
   //                                  );
   //                               abidecoder.addABI(ContractAbi);
   //                               const item = abidecoder.decodeLogs(
   //                                  transactionReceipt?.logs
   //                               );

   //                               if (item[0]?.name == chain.eventInfo) {
   //                                  saveEvent(
   //                                     item,
   //                                     event?.data?.transactionHash
   //                                  );
   //                               }

   //                               if (item[0]?.name == chain.resultInfo) {
   //                                  saveOrder(
   //                                     item,
   //                                     event?.data?.transactionHash
   //                                  );
   //                               }

   //                               if (item[0]?.name == chain.resultEvent) {
   //                                  console.log('item : ', item);
   //                               }
   //                            }
   //                         }
   //                         if (
   //                            event.toHuman().section == chain.ethereum &&
   //                            event.toHuman().method == chain.executed
   //                         ) {
   //                         }
   //                      });
   //                }
   //             );
   //          }
   //       } catch (error) {
   //          return error;
   //       }
   //    });
   // }

   async Native(api: any) {
      cron.schedule('*/6 * * * * *', async () => {
         try {
            const blockNumber = await web3.eth.getBlockNumber();
            console.log('Current block number:', blockNumber);
            const block = await web3.eth.getBlock(blockNumber);
            const currentDbBlock = await Block.findOne()
               .sort({ field: 'asc', _id: -1 })
               .limit(1);
            if (!currentDbBlock) {
               const currentBlock = new Block({
                  hash: block.hash,
                  number: block.number,
                  size: block.size,
                  timeStamp: block.timeStamp,
                  gasUsed: block.gasUsed,
               });

               await currentBlock.save();
               console.log('new block saved ');
            } else {
               if (currentDbBlock?.number < blockNumber) {
                  console.log(
                     'debug mode : ',
                     currentDbBlock?.number,
                     blockNumber
                  );

                  for (
                     let index = ++currentDbBlock.number;
                     index <= blockNumber;
                     index++
                  ) {
                     console.log('blocks to push ', index);
                     const blockByNumber = await web3.eth.getBlock(index);
                     const currentBlock = new Block({
                        hash: blockByNumber.hash,
                        number: blockByNumber.number,
                        size: blockByNumber.size,
                        timeStamp: blockByNumber.timeStamp,
                        gasUsed: blockByNumber.gasUsed,
                     });
                     console.log(blockByNumber.transactions);
                     blockByNumber.transactions.forEach(
                        async (transactionHash: string) => {
                           const transactionReceipt =
                              await web3.eth.getTransactionReceipt(
                                 transactionHash
                              );
                           abidecoder.addABI(ContractAbi);
                           const item = abidecoder.decodeLogs(
                              transactionReceipt?.logs
                           );

                           console.log('this is the item ', item);

                           switch (item[0]?.name) {
                              case chain.eventInfo:
                                 saveEvent(item, transactionHash);
                                 break;
                              case chain.responseInfo:
                                 saveOrder(item, transactionHash);
                                 break;
                              case chain.resultEvent:
                                 console.log(item[0]?.name + ' got triggered');
                                 break;
                              case chain.withdrawInfo:
                                 console.log(item[0]?.name + ' got triggered');
                                 console.log(
                                    item[0]?.events[0]?.value + ' got triggered'
                                 );
                                 console.log(
                                    item[0]?.events[1]?.value + ' got triggered'
                                 );
                                 console.log(
                                    item[0]?.events[2]?.value + ' got triggered'
                                 );
                                 console.log(
                                    item[0]?.events[3]?.value + ' got triggered'
                                 );
                                 updateWithdraw(item);
                                 break;
                              case chain.claimedRewardInfo:
                                 console.log(item[0]?.name + ' claim');
                                 console.log(
                                    item[0]?.events[0]?.value + ' eventid'
                                 );
                                 console.log(
                                    item[0]?.events[1]?.value +
                                       '  wallet address '
                                 );
                                 console.log(
                                    item[0]?.events[2]?.value +
                                       '  chaim  got triggered'
                                 );
                                 console.log(
                                    item[0]?.events[3]?.value + '  rewoard '
                                 );
                                 claimWithdraw(item);
                                 break;
                              default:
                                 // Handle default case if needed
                                 break;
                           }
                        }
                     );

                     await currentBlock.save();
                     console.log('new block saved ', index);
                  }
               }

               console.log('currentDB : ', currentDbBlock.number);
            }

            // console.log('block :', block);
         } catch (error) {
            return error;
         }
      });
   }

   async PriceUpdate() {
      cron.schedule('*/30 * * * * *', async () => {
         try {
            const options = {
               method: 'GET',
               url: process.env.COIN_MARKET_CAP_URL + priceListUrl,
               headers: {
                  Accept: 'application/json',
                  'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_KEY,
               },
               params: {
                  symbol: 'BTC,ETH,BCH,BNB,PMC,SOL,TRX,AVAX',
                  convert: 'USD',
               },
            };

            const prices = await axios.request(options);
            Object.entries(prices.data.data).forEach(
               async ([key, value]: [string, any]) => {
                  await Currency.findOneAndUpdate(
                     { symbol: key },
                     { price: value?.quote?.USD?.price }
                  );
               }
            );
            console.log('\n');
            console.log('Price Updated');
            console.log('\n');
         } catch (error) {
            console.error(error);
         }
      });
   }

   async BidCheck() {
      cron.schedule('*/60 * * * * *', async () => {
         try {
            const closeEvent = await Producer.getConnection(kafka.closeEvent);
            const getResults = await Producer.getConnection(kafka.getResults);
            const currentTimeStamp = +new Date();
            const data = await Events.find({
               eventExpireTime: timeStampToString(currentTimeStamp),
            });

            data.forEach((item) => {
               closeEvent(String(item._id));
               getResults(String(item.eventId));
            });
         } catch (error) {
            console.error(error);
         }
      });
   }
   async ResultCheck() {
      cron.schedule('*/60 * * * * *', async () => {
         try {
            const eventResult = await Producer.getConnection(kafka.eventResult);
            const currentTimeStamp = +new Date();

            const data = await Events.find({
               eventResultTime: timeStampToString(currentTimeStamp),
            });
            console.log('=-=-=-=-=-=-=-=->>>>> ', data);

            data.forEach((item) => {
               eventResult(String(item.eventId));
            });
         } catch (error) {
            console.error(error);
         }
      });
   }
}
export default new Worker();
