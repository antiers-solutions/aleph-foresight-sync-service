module.exports = {
   fields: {
      id: {
         type: 'text',
         default: 'Contract',
      },
      contractAddress: {
         type: 'text',
         default: '',
      },
      holder: 'text',
      contract_type: 'text',
      onChain: 'text',
      timestamp: {
         type: 'timestamp',
         default: { $db_function: 'toTimestamp(now())' },
      },
   },
   key: ['contractAddress', 'contract_type'],
};
