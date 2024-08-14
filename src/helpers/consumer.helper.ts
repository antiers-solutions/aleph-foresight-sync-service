const Web3 = require('web3');
import * as Sentry from '@sentry/node';
import Events from '../models/Events/index';
import ContractAbi from '../contracts/contract.abi';
import '../connection';
import { errorLog } from '../utils/constant.util';
const privateKey = process.env.ADMIN;
const contractAddress = process.env.CONTRACT_ADDRESS;

const resultCall = async (eventId: string, resultType: string) => {
   try {
      const web3 = new Web3(process.env.SOCKET_HOST);
      const contract = new web3.eth.Contract(ContractAbi, contractAddress);
      const account = web3.eth.accounts.wallet.add(privateKey).address;
      const txObject = contract.methods.set_result_event(
         eventId.trim(),
         resultType.trim()
      );
      // Estimate gas
      const gasEstimate = await txObject.estimateGas({
         from: account,
      });

      // Get the current nonce
      const nonce = await web3.eth.getTransactionCount(account);

      // Get the current gas price
      const gasPrice = await web3.eth.getGasPrice();
      const txdata = {
         from: account,
         to: contractAddress,
         gas: gasEstimate,
         gasPrice: web3.utils.toHex(gasPrice),
         nonce: web3.utils.toHex(nonce),
         data: txObject.encodeABI(),
      };

      // Sign the transaction
      const signedTx = await web3.eth.accounts.signTransaction(
         txdata,
         privateKey
      );

      // Send the transaction
      await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      await Events.findOneAndUpdate(
         {
            eventId: eventId,
         },
         {
            status: 2,
         }
      );

      return true;
   } catch (error) {
      Sentry.captureException(error);
      errorLog(error);
      return false;
   }
};
const getEventResult = async (eventId: string) => {
   try {
      const web3 = new Web3(process.env.SOCKET_HOST);
      const contract = new web3.eth.Contract(ContractAbi, contractAddress);
      const adminAddress = await contract.methods
         .read_pool_amount_event(eventId.trim())
         .call();
      return adminAddress;
   } catch (error) {
      Sentry.captureException(error);
      errorLog(error);
      return false;
   }
};
<<<<<<< HEAD

export { resultCall, getEventResult };
=======
const eventOdds = async (eventId: string) => {
   try {
      const web3 = new Web3(process.env.SOCKET_HOST);
      const contract = new web3.eth.Contract(ContractAbi, contractAddress);
      const eventOdds = await contract.methods
         .current_odds_event(eventId.trim())
         .call();
      return eventOdds;
   } catch (error) {
      Sentry.captureException(error);
      errorLog(error);
      return false;
   }
};
const eventCreationFees = async (eventId: string) => {
   try {
      const web3 = new Web3(process.env.SOCKET_HOST);
      const contract = new web3.eth.Contract(ContractAbi, contractAddress);
      const eventOdds = await contract.methods
         .get_platform_fee(eventId.trim())
         .call();
      return Number(eventOdds) / 100;
   } catch (error) {
      Sentry.captureException(error);
      errorLog(error);
      return false;
   }
};
export { resultCall, getEventResult, eventOdds, eventCreationFees };
>>>>>>> fb9ad29 (version 0.0.3 :Update platformfee.)
