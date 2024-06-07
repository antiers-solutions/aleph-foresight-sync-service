const Web3 = require('web3');
import ContractAbi from '../contracts/contract.abi';
const abidecoder = require('abi-decoder');
import {
   createAndSaveEvent,
   nullValidation,
   numberToString,
} from '../common/chain.common';
import NftToken from '../worker/nft';
import SocketEmitter from './socketEvent.helper';
import transactionHelper from './transaction.helper';
import TransactionHelper from './transaction.helper';
const { Logger } = require('../logger');
const { chainInitialise } = require('../common/chain.common');
const web3 = new Web3(process.env.SOCKET_HOST);
let is1155 = false;


class Evm {
   public connection: any;
   public count: any;
   public api: any;
   public transactions: any = {};

   constructor() {
      (async () => {
         this.connection = new Web3(process.env.SOCKET_HOST);
         this.api = await chainInitialise('Ethereum chain');
      })();
   }

   decodeHexString(event: any) {
      const hexString = event?.data?.log?.data?.toString();
      const cleanedHexString = hexString.startsWith('0x')
         ? hexString.slice(2)
         : hexString;

      // Decode the hexadecimal string
      const decodedValues = web3.eth.abi.decodeParameters(
         ['uint256', 'uint256'],
         cleanedHexString
      );
      const tokenId = decodedValues[0].toString();

      const amount = decodedValues[1].toString();
      return [Number(tokenId), amount];
   }

   decodeTokenId = (event: any) => {
      const evmdata = event?.data?.log?.topics;
      if (evmdata && evmdata.length > 3) {
         if (event?.data?.log?.data.length > 1) {
            const decodedHex = this.decodeHexString(event);
            is1155 = true;
            return decodedHex[0];
         } else {
            const uint256Value2 = evmdata[1] ? BigInt(evmdata[3]) : null;
            return Number(uint256Value2?.toString());
         }
      }
      return 0;
   };
   decodeFromTo = (event: any) => {
      const evmdata = event?.data?.log?.topics;
      if (evmdata && evmdata.length >= 3) {
         const from: string =
            Number(evmdata[1]) != 0
               ? '0x' + evmdata[1].toString().slice(26)
               : null;
         let to: string =
            Number(evmdata[2]) != 0
               ? '0x' + evmdata[2].toString().slice(26)
               : from;
         if (evmdata.length > 3) {
            const evmString = evmdata[3].toHuman();
            if (
               from == to &&
               Number(evmString.slice(2, evmString.length - 3)) != 0
            ) {
               to =
                  Number(evmdata[3]) != 0
                     ? '0x' + evmdata[3].toString().slice(26)
                     : to;
            }
         }
         return [from, to];
      }

      return [null, null];
   };

   // saveTransaction = async (Transaction: any, T_count: number) => {
   //    let transfer = 0;
   //    const count = await TransactionHelper.getLastSavedTransacdb();
   //    if (count > T_count) return;
   //    const transaction = Object.values(this.transactions);
   //    this.transactions = {};
   //    let txnHash: string;
   //    const values: any = [];
   //    const promises = transaction?.map(async (transactionDetail: any) => {
   //       values.push(transactionDetail);
   //       txnHash = transactionDetail.txnHash;
   //       T_count = T_count + 1;
   //       Logger.info(T_count + ' EVM');

   //       transactionDetail.count = T_count;
   //       transfer =
   //          transfer + transactionDetail.value ? transactionDetail.value : 0;

   //       const transac = new Transaction(transactionDetail);
   //       const eventsDataProps: any = transactionDetail;
   //       let isTrans = true;
   //       if (isTrans) {
   //          SocketEmitter.emitMessage('latest_transaction', {
   //             block_number: transac.block_number,
   //             txnHash: transac.txnHash,
   //             transactionCount: transac.count,
   //             sectionmethod: transac.sectionmethod,
   //             status: transac.status,
   //          });
   //          isTrans = false;
   //       }

   //       const saveTransaction = new Promise((resolve, reject) => {
   //          transac.save((err: any, result: any) => {
   //             if (err) {
   //                reject(err);
   //             } else {
   //                resolve(result);
   //             }
   //          });
   //       });
   //       await createAndSaveEvent(eventsDataProps)
   //          .then(() => {
   //             Logger.info('Events data saved');
   //          })
   //          .catch((err) => {
   //             Logger.error('Error events: ' + err);
   //          });

   //       saveTransaction
   //          .then(async () => {
   //             if (
   //                transactionDetail.sectionmethod == 'evm.Log' &&
   //                transactionDetail.tokenId != null &&
   //                transactionDetail.contractAddress
   //             ) {
   //                NftToken.Nft(
   //                   await this.api,
   //                   transactionDetail.tokenId,
   //                   transactionDetail.contractAddress
   //                );
   //             }
   //          })
   //          .catch((error) => {
   //             Logger.error('Error saving transaction: ' + error);
   //          });
   //       return saveTransaction;
   //    });

   //    return transfer;
   // };

   getNftTrans = async (allRecords: any, count: number, index: any) => {
      allRecords
         .filter(
            ({ phase }: any) =>
               phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)
         )
         .map(async ({ event }: any) => {
            let isContract = false;
            is1155 = false;
            if (event.toHuman().method == 'Log') {
               isContract = true;
               let txData = this.transactions[this.decodeFromTo(event)[0]];
               if (txData || Object.keys(this.transactions).length == 1) {
                  if (!txData) {
                     txData = Object.values(this.transactions)[0];
                  }
                  const transactionDetail: any = {
                     block_number: txData?.block_number,
                     txnHash: txData?.txnHash ? txData?.txnHash : '',
                     status: txData.status,
                     reason: null,
                     sectionmethod: `evm.Log`,
                     from: isContract
                        ? this.decodeFromTo(event)[0]
                        : txData?.from
                           ? txData.from
                           : null,
                     to: isContract
                        ? this.decodeFromTo(event)[1]
                        : txData?.to
                           ? txData.to
                           : null,
                     contractAddress:
                        event?.data?.log?.address?.toHuman() ||
                        txData.contractAddress,
                     timestamp: txData.timestamp,
                     tokenId: isContract ? this.decodeTokenId(event) : null,
                     txfee: txData.txfee,
                     value: is1155
                        ? this.decodeHexString(event)[1]?.toString()
                        : txData?.value
                           ? txData?.value
                           : null,
                     count: count,
                  };

                  this.transactions[txData.txnHash] = transactionDetail;

                  isContract = false;
               }
            }
         });
   };

   getEvmTrans = async (txn: string, sectionmethod: string, count: number) => {
      const txData = await this.connection?.eth?.getTransaction(txn);
      const xxxxxxxx = await web3.eth.getTransactionReceipt(txn)
      console.log("with events : ", xxxxxxxx.logs[0]?.data);
      // const yyyyyy = await web3.eth.abi.decodeParameters(['uint256', 'uint256', 'uint256', 'address', 'address', 'string'], xxxxxxxx?.logs[0]?.data)
      abidecoder.addABI(ContractAbi);
      const item = abidecoder.decodeLogs(xxxxxxxx?.logs);
      console.log("yyyyyy : ", item[0]?.events[0]);
      console.log("yyyyyy : ", item[0]?.events[1]);
      console.log("yyyyyy : ", item[0]?.events[2]);
      console.log("yyyyyy : ", item[0]?.events[3]);
      if (txData) {
         console.log("txData : ", txData);

         const txFee = Number((txData?.gasPrice * txData?.gas) / 10 ** 18);
         const web3Fees =
            Web3.utils.fromWei(txData?.value.toString(), 'ether') != '0'
               ? Web3.utils.fromWei(txData?.value.toString(), 'ether')
               : null;
         const transactionDetail: any = {
            block_number: txData?.blockNumber,
            txnHash: txData?.hash ? txData?.hash : '',
            status: 'pending',
            reason: null,
            sectionmethod: `${sectionmethod}`,
            from: txData?.from ? txData.from : null,
            to: txData?.to ? txData.to : null,
            contractAddress: nullValidation(txData.contractAddress),
            timestamp: `${new Date().getTime()}`,
            tokenId: null,
            txfee: nullValidation(txFee),
            value: txData?.value
               ? web3Fees !== null
                  ? Number(web3Fees).toFixed(8)
                  : null
               : null,
            count: count,
         };

         const finalizedTx = await this.connection?.eth?.getTransactionReceipt(
            txData?.hash
         );
         if (finalizedTx) {
            transactionDetail.status = finalizedTx?.status
               ? 'success'
               : 'failed';
            transactionDetail.txfee = nullValidation(
               finalizedTx?.gasUsed
                  ? Number((txData?.gasPrice * finalizedTx?.gasUsed) / 10 ** 18)
                  : 0
            );
         }
         this.transactions[txData.from.toLowerCase()] = transactionDetail;
      }
      return 0;
   };

   async getLatestFinalizedBlock() {
      const latestBlockNumber = await this.connection?.eth?.getBlockNumber();
      return latestBlockNumber;
   }

   // Check if a block is finalized
   async isBlockFinalized(blockNumber: any) {
      const latestFinalizedBlock = await this.getLatestFinalizedBlock();
      return blockNumber <= latestFinalizedBlock;
   }

   getEvmBlock = async (
      blockNumber: number,
      sectionmethod: string,
      count: number,
      allRecords?: any,
      index?: any
   ) => {
      let isConnected = true;
      this.connection.eth.net
         .isListening()
         .then(async () => {
            isConnected = true;
         })
         .catch(() => {
            isConnected = false;
            Logger.error('Lost connection to the node, reconnecting');
            this.connection = new Web3(process.env.SOCKET_HOST);
            isConnected = true;
         });
      if (isConnected) {
         try {
            const blockData = await this.connection?.eth?.getBlock(blockNumber);
            const T_count = count;

            const isFinalized = await this.isBlockFinalized(blockData.number);

            let events = 0;
            let transfers = 0;
            this.count = 0;

            for (const txHash of blockData.transactions) {
               events = events + 1;
               const transectionsOfTheEvm = await this.getEvmTrans(txHash, sectionmethod, T_count);
               console.log('transectionsOfTheEvm : ', transectionsOfTheEvm);

            }
            await this.getNftTrans(allRecords, T_count, index);

            // transfers = await this.saveTransaction(Transaction, T_count);

            const Blockpayload = {
               parentHash: blockData.parentHash,
               hash: blockData.hash,
               bnumber: blockData.number,
               stateRoot: blockData.stateRoot,
               isFinal: isFinalized,
               extrinsicsRoot: blockData.transactionsRoot,
               validator: nullValidation(blockData.miner),
               transfer: numberToString(transfers),
               weight: numberToString(blockData.size),
               deposit: numberToString(blockData.gasUsed),
               eventCount: events,
               extrinsicCount: blockData.length,
               transactionCount: blockData.transactions.length,
               transactionTimeStamp: `${new Date(
                  blockData.timestamp * 1000
               ).getTime()}`,
            };

            // const test = new Block(Blockpayload);
            console.log('Blockpayload : ', Blockpayload);

            // test.save((err: any) => {
            //    if (err) {
            //       Logger.error(err);
            //    }
            // });
            return blockData.transactions.length + this.count;
         } catch (error) {
            Logger.error(error.toString());
         }
      }
   };
}

export default new Evm();
