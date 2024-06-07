const { Logger } = require('../logger');


class TransactionHelper {
   getLastSavedTransacdb = async () => {

   };



   getNftTransaction = async (contractAddress?: any, tokenId?: any) => {
      return new Promise((resolve, reject) => {
         try {
            const query = {
               sectionmethod: {
                  $in: [
                     'contracts.Mint',
                     'contracts.Transfer',
                     'contracts.UpdatedURI',
                     'contracts.BatchMint',
                     'contracts.TransferBatch',
                     'evm.Log',
                  ],
               },
               contractAddress: contractAddress ? contractAddress : {},
               tokenId: tokenId ? tokenId : {},
            };
         } catch (error) {
            reject([]);
         }
      });
   };
   getTransactionAmount = async (bnumber: number) => {
      return new Promise((resolve, reject) => {
         try {

         } catch (error) {
            reject([]);
         }
      });
   };
}

export default new TransactionHelper();
