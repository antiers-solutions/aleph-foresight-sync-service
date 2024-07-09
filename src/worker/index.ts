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
import Block from '../models/Block';
import updateWithdraw from '../helpers/withdraw.helper';
import claimReward from '../helpers/claim.helper';
import updateOrder from '../helpers/result.helper';
let web3 = new Web3(process.env.SOCKET_HOST);

class Worker {
   public connection: any;

   async Native() {
      cron.schedule('*/6 * * * * *', async () => {
         try {
            const blockNumber = await web3.eth.getBlockNumber();

            if (!blockNumber) {
               web3 = new Web3(process.env.SOCKET_HOST);
            }

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
                                 console.log(
                                    item[0]?.events[0]?.value +
                                       ' <<<<<<<<<<<<<,--------------'
                                 );
                                 console.log(
                                    item[0]?.events[1]?.value +
                                       '<----------------------'
                                 );
                                 updateOrder(item);
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
                                 claimReward(item);
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
