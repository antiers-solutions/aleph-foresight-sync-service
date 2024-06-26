import Events from '../models/Events/index';
import ContractAbi from '../contracts/contract.abi';
import '../connection';
import { errorLog } from '../utils/constant.util';
const Web3 = require('web3');
const web3 = new Web3(process.env.SOCKET_HOST);
const privateKey = process.env.ADMIN;
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(ContractAbi, contractAddress);
const account = web3.eth.accounts.wallet.add(privateKey).address;
const resultCall = async (eventId: string, resultType: string) => {
   try {
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
      errorLog(error);
      return false;
   }
};

export default resultCall;
