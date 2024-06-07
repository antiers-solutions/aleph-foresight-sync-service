import * as config from './config';
(async () => {
   await config.initiate();
})();
const ExpressCassandra = require('express-cassandra');
const connect = ExpressCassandra.createClient({
   clientOptions: {
      contactPoints: [process.env.contactPoints],
      localDataCenter: 'datacenter1',
      protocolOptions: { port: process.env.DB_PORT },
      keyspace: process.env.keyspace,
      credentials: {
         username: process.env.userName,
         password: process.env.passWord,
      },
      queryOptions: { consistency: ExpressCassandra.consistencies.one },
      paging: { local: true }, // enable local paging
      socketOptions: { readTimeout: 60000 },
   },
   ormOptions: {
      defaultReplicationStrategy: {
         class: 'SimpleStrategy',
         replication_factor: 1,
      },
      migration: 'safe',
   },
});
const Contract = connect.loadSchema('contract', require('./models/Contract'));
const Block = connect.loadSchema('block', require('./models/Block'));
const Transaction = connect.loadSchema(
   'transaction',
   require('./models/Transaction')
);
const Events = connect.loadSchema(
   'events',
   require('./models/Transaction/events')
);
export const models = {
   Block: Block,
   Transaction: Transaction,
   Contract: Contract,
   Events: Events,
};

console.log('Cassandra connected');

module.exports = { connect, models };
