const cron = require('node-cron');
const Web3 = require('web3');
import saveEvent from '../helpers/event.helper';
import * as Producer from '../repanda/producer';
import ContractAbi from '../contracts/contract.abi';
import saveOrder from '../helpers/order.helper';
import Events from '../models/Events/index';
import timeStampToString from '../helpers/commom.helper';
import axios from 'axios';
import Currency from '../models/Currency/index';
import { priceListUrl } from '../utils/constents.util';
const abidecoder = require('abi-decoder');
const web3 = new Web3('wss://wallet-l0.pstuff.net');

class Worker {
   public connection: any;

   async Native(api: any) {
      cron.schedule('*/6 * * * * *', async () => {
         // const sendMessage = await Producer.getConnection('veer');

         try {
            const metadata = await api.rpc.state.getMetadata();
            await api.registry.setMetadata(metadata);
            const blockHeader = await api.rpc.chain.getHeader();
            const blockNumber = await blockHeader.number.toNumber();
            console.log('blockNumber ========>>>>', blockNumber);
            // sendMessage(blockNumber)

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
                           if (
                              event.toHuman().section == 'ethereum' &&
                              event.toHuman().method == 'Executed'
                           ) {
                              console.log(
                                 'event$$$$$$$$$$$$$ ',
                                 event?.data?.toHuman()?.transactionHash
                              );
                              const xxxxxxxx =
                                 await web3.eth.getTransactionReceipt(
                                    event?.data?.toHuman()?.transactionHash
                                 );
                              console.log('1EVENT DATA =========>>>', xxxxxxxx);
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
               async ([key, value]: any) => {
                  await Currency.findOneAndUpdate(
                     { symbol: key },
                     { price: value?.quote?.USD?.price }
                  );
               }
            );

            // console.log("prices :", prices.data.data);
         } catch (error) {
            console.error(error);
         }
      });
   }

   async BidCheck() {
      cron.schedule('*/30 * * * * *', async () => {
         try {
            const sendMessage = await Producer.getConnection('closeEvent');
            const getResults = await Producer.getConnection('getResults');
            const currentTimeStamp = +new Date();
            const data = await Events.find({
               eventExpireTime: timeStampToString(currentTimeStamp),
            });

            data.forEach((item) => {
               sendMessage(String(item._id));
               getResults(String(item.eventId));
            });
         } catch (error) {
            console.error(error);
         }
      });
   }
}
export default new Worker();
