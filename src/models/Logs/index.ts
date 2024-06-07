module.exports = {
   fields: {
      id: {
         type: 'uuid',
         default: { $db_function: 'uuid()' },
      },
      method: 'text',
      url: 'text',
      status: 'text',
      length: 'text',
      time: {
         type: 'text',
      },
      res_time: 'text',
   },
   key: ['id'],
};
