const Web3 = require('web3');
import ContractAbi from '../contracts/contract.abi';
const abidecoder = require('abi-decoder');
import { nullValidation } from '../common/chain.common';
const { chainInitialise } = require('../common/chain.common');
const web3 = new Web3('wss://wallet-l0.pstuff.net');

class Evm {
   public connection: any;
   public count: any;
   public api: any;
   public transactions: any = {};

   constructor() {
      (async () => {
         this.connection = new Web3('wss://wallet-l0.pstuff.net');
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

   // decodeTokenId = (event: any) => {
   //    const evmdata = event?.data?.log?.topics;
   //    if (evmdata && evmdata.length > 3) {
   //       if (event?.data?.log?.data.length > 1) {
   //          const decodedHex = this.decodeHexString(event);
   //          is1155 = true;
   //          return decodedHex[0];
   //       } else {
   //          const uint256Value2 = evmdata[1] ? BigInt(evmdata[3]) : null;
   //          return Number(uint256Value2?.toString());
   //       }
   //    }
   //    return 0;
   // };
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
   getEvmTrans = async (txn: string, sectionmethod: string, count: number) => {
      const txData = await this.connection?.eth?.getTransaction(txn);
      const xxxxxxxx = await web3.eth.getTransactionReceipt(txn);
      console.log('with events : ', xxxxxxxx.logs[0]?.data);
      // const yyyyyy = await web3.eth.abi.decodeParameters(['uint256', 'uint256', 'uint256', 'address', 'address', 'string'], xxxxxxxx?.logs[0]?.data)
      abidecoder.addABI(ContractAbi);
      const item = abidecoder.decodeLogs(xxxxxxxx?.logs);
      console.log('yyyyyy : ', item[0]?.events[0]);
      console.log('yyyyyy : ', item[0]?.events[1]);
      console.log('yyyyyy : ', item[0]?.events[2]);
      console.log('yyyyyy : ', item[0]?.events[3]);
      if (txData) {
         console.log('txData : ', txData);
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
}

export default new Evm();
