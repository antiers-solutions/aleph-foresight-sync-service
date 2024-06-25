import Events from '../models/Events/index';
import ContractAbi from '../contracts/contract.abi';
import { EventData } from '../interfaces/consumer.interfaces';

const Web3 = require('web3');
console.log(
   '>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ',
   process.env.ADMIN,
   process.env.CONTRACT_ADDRESS
);
const web3 = new Web3('wss://wallet-l0.pstuff.net');
const privateKey =
   '0xfaa4a134320005736b45a6048ef6cec96c8abeef0bf28c0b10ba722ea84aa7cb';
const contractAddress = '0x23e76e48330Dc95Fd5C682E4011c526f94091811';
const contract = new web3.eth.Contract(ContractAbi, contractAddress);
const account = web3.eth.accounts.wallet.add(privateKey).address;
console.log('account : ', account);

// 'result_event(string,string)': [Function: bound _createTxObject],

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
      console.log('error : ', error);
      return false;
   }
};

export default resultCall;
