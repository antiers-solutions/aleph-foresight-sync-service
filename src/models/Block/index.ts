module.exports = {
   fields: {
      id: {
         type: 'text',
         default: 'Block',
      },
      parentHash: 'text',
      hash: 'text',
      bnumber: 'int',
      blockSize: 'int',
      stateRoot: 'text',
      isFinal: 'boolean',
      extrinsicsRoot: 'text',
      validator: 'text',
      transfer: 'text',
      weight: 'text',
      deposit: 'text',
      eventCount: 'int',
      extrinsicCount: 'int',
      transactionCount: 'int',
      transactionTimeStamp: { type: 'text' },
      created_at: {
         type: 'timestamp',
         default: { $db_function: 'toTimestamp(now())' },
      },
   },
   key: ['id', 'bnumber'],
   clustering_order: { bnumber: 'desc' },
};
