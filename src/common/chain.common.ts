import { ApiPromise, WsProvider } from '@polkadot/api';
import { formatBalance, isUndefined } from '@polkadot/util';
const { TypeRegistry } = require('@polkadot/types/create');
import {
   apiError,
   chainInitialisedLog,
   connections,
   system,
} from '../utils/constant.util';
import '../connection';
// const { Logger } = require('../logger');
// let wsProvider = new WsProvider(process.env.SOCKET_HOST);

// const EventData = {
//    Address: 'AccountId',
//    Amount: 'Balance',
// };

export const nullValidation = (value: any): null | string => {
   if (value === system.null || value === system.nan) return null;
   else if (value === 0) return value.toString();
   else return value ? value.toString() : null;
};

export const numberToString = (value: any): string => {
   return value ? value.toString() : '0';
};
