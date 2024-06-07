module.exports = {
   fields: {
      id: {
         type: 'text',
         default: 'Token',
      },
      token_id: 'int',
      image: 'text',
      location: 'text',
      creator: {
         type: 'text',
      },
      owner: {
         type: 'text',
      },
      price: 'bigint',
      amount: {
         type: 'int',
         default: 0,
      },
      contract_add: {
         type: 'text',
      },
      token_standard: {
         type: 'text',
      },
      name: 'text',
      sectionmethod: 'text',
      description: 'text',
      mint_time: {
         type: 'text',
      },
      updated_at: {
         type: 'timestamp',
         default: { $db_function: 'toTimestamp(now())' },
      },
   },
   key: [['contract_add', 'token_id', 'owner']],
};
