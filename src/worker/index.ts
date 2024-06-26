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

const web3 = new Web3(process.env.SOCKET_URL);
const contract = new web3.eth.Contract(
   ContractAbi,
   process.env.CONTRACT_ADDRESS
);
// const account = web3.eth.accounts.wallet.add(process.env.ADMIN).get(0);

class Worker {
   public connection: any;

   async Native(api: any) {
      cron.schedule('*/6 * * * * *', async () => {
         try {
            const metadata = await api.rpc.state.getMetadata();
            await api.registry.setMetadata(metadata);
            const blockHeader = await api.rpc.chain.getHeader();
            const blockNumber = await blockHeader.number.toNumber();
            console.log('blockNumber == > ', blockNumber);

            for (let index = blockNumber; index <= blockNumber; index++) {
               const blockHash = await api.rpc.chain.getBlockHash(index);
               const block = await api.rpc.chain.getBlock(blockHash);
               let events = 0;
               const arr: LogsStructure[] = [];
               block.block.header.forEach((logs: any) => {
                  arr.push(logs.toHuman());
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
                              (event.toHuman().section == chain.evm ||
                                 event.toHuman().section == chain.ethereum) &&
                              (event.toHuman().method == chain.executed ||
                                 event.toHuman().method == chain.log)
                           ) {
                              if (event?.data?.transactionHash) {
                                 const transactionReceipt =
                                    await web3.eth.getTransactionReceipt(
                                       event?.data?.transactionHash
                                    );
                                 abidecoder.addABI(ContractAbi);
                                 const item = abidecoder.decodeLogs(
                                    transactionReceipt?.logs
                                 );

                                 if (item[0]?.name == chain.eventInfo) {
                                    saveEvent(
                                       item,
                                       event?.data?.transactionHash
                                    );
                                 }

                                 if (item[0]?.name == chain.resultInfo) {
                                    saveOrder(
                                       item,
                                       event?.data?.transactionHash
                                    );
                                 }

                                 if (item[0]?.name == chain.resultEvent) {
                                    console.log('item : ', item);
                                 }
                              }
                           }
                           if (
                              event.toHuman().section == chain.ethereum &&
                              event.toHuman().method == chain.executed
                           ) {
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
         // console.log(">>>>>------->>>>>>>> ", contract.methods);

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
         console.log('testing 123');
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
