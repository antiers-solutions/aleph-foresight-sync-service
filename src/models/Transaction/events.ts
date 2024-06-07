module.exports = {
   fields: {
      from: 'text',
      to: 'text',
      reason: 'text',
      sectionmethod: {
         type: 'text',
         default: null,
      },
      txfee: 'text',
      value: 'text',
      contractAddress: {
         type: 'text',
         default: '',
      },
      tokenId: {
         type: 'int',
         default: 0,
      },
      txnHash: {
         type: 'text',
         foreign_key: {
            references: {
               model: 'Transaction',
               key: 'txnHash',
            },
         },
      },
      timestamp: {
         type: 'text',
      },
   },
   key: ['txnHash', 'sectionmethod', 'tokenId'],
};
