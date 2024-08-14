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
import * as Sentry from '@sentry/node';
import saveUpdateExpTime from '../helpers/updateExpireTime.helper';
import updateBetClosureTime from '../helpers/saveUpdateBetClosure.helper';

class Worker {
   public connection: any;

   async Native() {
      cron.schedule('*/4 * * * * *', async () => {
         try {
            const blockNumber = await web3.eth.getBlockNumber();

            if (!blockNumber) {
               web3 = new Web3(process.env.SOCKET_HOST);
            }
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
            } else {
               if (currentDbBlock?.number < blockNumber) {
                  for (
                     let index = ++currentDbBlock.number;
                     index <= blockNumber;
                     index++
                  ) {
                     const blockByNumber = await web3.eth.getBlock(index);
                     const currentBlock = new Block({
                        hash: blockByNumber.hash,
                        number: blockByNumber.number,
                        size: blockByNumber.size,
                        timeStamp: blockByNumber.timeStamp,
                        gasUsed: blockByNumber.gasUsed,
                     });
                     console.info(
                        `\x1b[36m no of transections in ${blockByNumber.number} this block`,
                        blockByNumber?.transactions?.length
                     );
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
                           if (
                              item[0]?.address?.toLowerCase() ==
                              process.env.CONTRACT_ADDRESS.toLowerCase()
                           ) {
                              switch (item[0]?.name) {
                                 case chain.eventInfo:
                                    saveEvent(item, transactionHash);
                                    break;
                                 case chain.responseInfo:
                                    saveOrder(item, transactionHash);
                                    break;
                                 case chain.resultEvent:
                                    updateOrder(item);
                                    break;
                                 case chain.withdrawInfo:
                                    updateWithdraw(item);
                                    break;
                                 case chain.claimedRewardInfo:
                                    claimReward(item);
                                    break;
                                 case chain.newEventExpTime:
                                    saveUpdateExpTime(item);
                                    break;
                                 case chain.newBetClosureTime:
                                    updateBetClosureTime(item);
                                    break;
                                 default:
                                    // Handle default case if needed
                                    break;
                              }
                           }
                        }
                     );

                     await currentBlock.save();
                  }
               }

               console.info(
                  '\x1b[34m current block in databse : ',
                  currentDbBlock.number
               );
            }
         } catch (error) {
            web3 = new Web3(process.env.SOCKET_HOST);
            Sentry.captureException(error);
            return error;
         }
      });
   }

   async PriceUpdate() {
      cron.schedule('*/60 * * * * *', async () => {
         try {
            const crruncyData = await Currency.find();
            const symbols = crruncyData.map((item) => item.symbol).join(',');
            const options = {
               method: 'GET',
               url: process.env.COIN_MARKET_CAP_URL + priceListUrl,
               headers: {
                  Accept: 'application/json',
                  'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_KEY,
               },
               params: {
                  symbol: symbols,
                  convert: 'USD',
               },
            };
            const prices = await axios.request(options);
            Object.entries(prices.data.data).forEach(
               async ([key, value]: [string, any]) => {
                  console.info(
                     `\x1b[36m price for ${key} has been updated to  `,
                     value?.quote?.USD?.price
                  );
                  await Currency.findOneAndUpdate(
                     { symbol: key },
                     { price: value?.quote?.USD?.price }
                  );
               }
            );
         } catch (error) {
            Sentry.captureException(error);
            console.error(error);
         }
      });
   }

   async BidCheck() {
      cron.schedule('*/60 * * * * *', async () => {
         try {
            const closeEvent = await Producer.getConnection(kafka.closeEvent);
            const closeBid = await Producer.getConnection(kafka.closeBid);
            const getResults = await Producer.getConnection(kafka.getResults);
            const currentTimeStamp = +new Date();
            const eventExpire = await Events.find({
               eventExpireTime: timeStampToString(currentTimeStamp),
            });

            eventExpire &&
               eventExpire.forEach((item) => {
                  closeEvent(String(item._id));
                  getResults(String(item.eventId));
               });

            const bidExpire = await Events.find({
               betExpireTime: timeStampToString(currentTimeStamp),
            });

            bidExpire &&
               bidExpire.forEach((item) => {
                  closeBid(String(item.eventId));
               });
         } catch (error) {
            Sentry.captureException(error);

            console.error(error);
         }
      });
   }
   async ResultCheck() {
      cron.schedule('*/60 * * * * *', async () => {
         try {
            const eventResult = await Producer.getConnection(kafka.eventResult);
            const disputeClose = await Producer.getConnection(
               kafka.disputeClose
            );
            const currentTimeStamp = +new Date();

            const eventResultData = await Events.find({
               eventResultTime: timeStampToString(currentTimeStamp),
            });

            const disputeCloseEvent = await Events.find({
               disputeCloserTime: timeStampToString(currentTimeStamp),
            });

            disputeCloseEvent.forEach((item) => {
               disputeClose(String(item.eventId));
            });

            eventResultData.forEach((item) => {
               eventResult(String(item.eventId));
            });
         } catch (error) {
            Sentry.captureException(error);

            console.error(error);
         }
      });
   }
}
export default new Worker();
