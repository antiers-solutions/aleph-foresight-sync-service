import { ApiPromise, WsProvider } from '@polkadot/api';

import { formatBalance, isUndefined } from '@polkadot/util';
const { TypeRegistry } = require('@polkadot/types/create');
let wsProvider = new WsProvider(process.env.SOCKET_HOST);
const { Logger } = require('../logger');
const EventData = {
   Address: 'AccountId',
   Amount: 'Balance',
};

let api: any;
export const chainInitialise = async (controllName: string) => {
   const registry = new TypeRegistry();
   registry.register({
      EventData,
   });

   wsProvider.on('disconnected', () => {
      Logger.error('disconnected ' + wsProvider);
   });
   api = await ApiPromise.create({ provider: wsProvider, registry });
   api.on('connected', () =>
      Logger.info(`Chain initialised for ${controllName} controller`)
   );
   api.on('disconnected', async () => {
      try {
         wsProvider.on('connected', async () => {
            api = await ApiPromise.create({ provider: wsProvider, registry });
            return;
         });
      } catch (error) {
         Logger.error('Error api connection : ' + error);
      }
   });
   Logger.info(`Chain initialised for ${controllName} controller`);
   setInterval(async () => {
      if (api.isConnected === false) {
         wsProvider = new WsProvider(process.env.SOCKET_HOST);
         api = await ApiPromise.create({
            provider: wsProvider,
            registry,
         });
      }
   }, 10000);
   return api;
};

export const nullValidation = (value: any): null | string => {
   if (value === 'null' || value === 'NaN') return null;
   else if (value === 0) return value.toString();
   else return value ? value.toString() : null;
};

export const numberToString = (value: any): string => {
   return value ? value.toString() : '0';
};

export const reformat = (
   value?: string,
   isDisabled = false,
   siDecimals?: number
): { defaultValue?: string; siDefault?: any } => {
   if (!value) {
      return {};
   }

   const defaultValue = formatBalance(String(value).replace(/,/g, ''), {
      decimals: isUndefined(siDecimals) ? 18 : siDecimals,
      forceUnit: '-',
      withSi: false,
   });

   return {
      defaultValue: isDisabled
         ? // since we drop 0's ensure we have at least 4 for disabled
         `${defaultValue}.`
            .split('.')
            .slice(0, 2)
            .map((v, i) => (i ? v.padEnd(4, '0') : v))
            .join('.')
         : // remove the format specifiers for inputs
         defaultValue.replace(/,/g, ''),
      siDefault: formatBalance.findSi('-'),
   };
};
interface EventsData {
   from: any;
   to: any;
   value: any;
   reason: string | null;
   sectionmethod: string;
   txnHash: any;
   txfee: any;
   tokenId: number | null;
   contractAddress: any;
   timestamp: any;
}
export const eventValues = [
   'from',
   'to',
   'value',
   'reason',
   'sectionmethod',
   'txfee',
   'tokenId',
   'contractAddress',
];

export function createAndSaveEvent(eventsDataProps: any): Promise<void> {
   const {
      from,
      to,
      value,
      reason,
      sectionmethod,
      txnHash,
      txfee,
      tokenId,
      contractAddress,
      timestamp,
   } = eventsDataProps;
   const eventsData: EventsData = {
      from: from,
      to: to,
      value: value,
      reason: reason,
      sectionmethod: sectionmethod,
      txnHash: txnHash,
      txfee: txfee,
      tokenId: tokenId ? tokenId : 0,
      contractAddress: contractAddress,
      timestamp: timestamp,
   };

   return new Promise<void>((resolve, reject) => {

   });
}
