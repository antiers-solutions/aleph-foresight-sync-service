import Evm from '../helpers/evm.helper';

exports.evmEvent = async (
   section: any,
   method: any,
   blocknumber: any,
   T_count: number,
   allRecords?: any,
   index?: any
) => {
   const evm_transaction_count: number = await Evm.getEvmBlock(
      blocknumber,
      `${section}.${method}`,
      T_count,
      allRecords,
      index
   );
   return evm_transaction_count;
};
