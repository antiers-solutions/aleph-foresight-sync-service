const system = {
   null: 'null',
   nan: 'NaN',
};

const envType = {
   development: 'development',
};

const morganMiddlewareParam =
   ':method :url :status :res[content-length] - :response-time ms';

const priceListUrl = '/cryptocurrency/quotes/latest';

const connections = {
   disconnected: 'disconnected',
   connected: 'connected',
   connecting: 'connecting',
   connection: 'connection',
   error: 'error',
};
const chainInitialisedLog = (controllName: string) =>
   `Chain initialised for ${controllName} controller`;
const apiError = 'Error api connection : ';

const errorLog = (error: any) => console.log('Error : ', error);

const resolutionSource = 'https://coinmarketcap.com/currencies/';

const orderTypes = {
   yes: 'Yes',
   no: 'No',
};

const socketSuccess = 'Socket connected successfully';

const mongoDb = {
   errorLog: 'Error while connecting to MongoDB: ',
   connecting: 'Connecting to mongodb server',
   connected: 'MongoDB connected',
   disconnected: 'MongoDB disconnected',
   onError: 'MongoDB error: ',
   onErrorBinding: 'Error while binding the mongodb conncetion events: ',
   connectionIssue: 'Unable to connect mongodb',
};

const kafka = {
   syncService: 'sync-service',
   closeEvent: 'closeEvent',
   getResults: 'getResults',
   eventResult: 'eventResult',
   initialiseFailed: 'Failed to initialize redpanda',
   sigint: 'SIGINT',
   close: 'Closing app...',
   cleanupError: 'Error during cleanup: ',
   cleanupFinish: 'Cleanup finished. Exiting',
};

const chain = {
   evm: 'evm',
   ethereum: 'ethereum',
   executed: 'Executed',
   log: 'Log',
   eventInfo: 'event_info',
   resultInfo: 'response_info',
   resultEvent: 'event_result_info',
   withdrawInfo: 'withdraw_info',
   platformFeeInfo: 'platform_fee_info',
   eventCreationFeeInfo: 'event_creation_fee_info',
   claimedRewardInfo: 'claimed_reward_info',
   newEventExpirationTimeInfo: 'new_event_expiration_time_info',
   newBetClosureTimeInfo: 'new_bet_closure_time_info',
};

export {
   priceListUrl,
   connections,
   chainInitialisedLog,
   apiError,
   system,
   envType,
   morganMiddlewareParam,
   errorLog,
   resolutionSource,
   orderTypes,
   socketSuccess,
   mongoDb,
   kafka,
   chain,
};
