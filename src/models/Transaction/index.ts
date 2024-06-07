module.exports = {
   fields: {
      id: {
         type: 'text',
         default: 'Transaction',
      },
      status: 'text',
      block_number: 'int',
      from: 'text',
      to: 'text',
      reason: 'text',
      sectionmethod: 'text',
      txfee: 'text',
      value: 'text',
      txnHash: {
         type: 'text',
      },
      tokenId: {
         type: 'int',
         default: null,
      },
      contractAddress: {
         type: 'text',
         default: '',
      },
      count: 'int',
      timestamp: {
         type: 'text',
      },
   },
   key: ['id', 'count'],
   clustering_order: { count: 'desc' },
};
