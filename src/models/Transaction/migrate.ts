module.exports = {
   fields: {
      id: {
         type: 'text',
         default: 'Transaction',
         primary_key: true,
      },
      status: 'text',
      block_number: 'int',
      txnHash: {
         type: 'text',
         unique: true,
      },
      count: 'int',
      timestamp: {
         type: 'text',
      },
   },
   key: ['id', 'count', 'txnHash'],
   clustering_order: { count: 'desc' },
};
