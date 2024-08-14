import { nullValidation, numberToString } from '../common/chain.common';
// import { ApiPromise, WsProvider } from '@polkadot/api';
// import { TypeRegistry } from '@polkadot/types/create';
// import { formatBalance } from '@polkadot/util';
// import { SiDef } from '@polkadot/util/types';
// import { Logger } from '../logger';
import { connections, system } from '../utils/constant.util';

jest.mock('@polkadot/api');
jest.mock('@polkadot/types/create');
jest.mock('@polkadot/util');

// const mockWsProvider = new (WsProvider as jest.MockedClass<typeof WsProvider>)() as jest.Mocked<WsProvider>;
// const mockApiPromise = new (ApiPromise as jest.MockedClass<typeof ApiPromise>)() as jest.Mocked<ApiPromise>;
// const mockTypeRegistry = new (TypeRegistry as jest.MockedClass<typeof TypeRegistry>)() as jest.Mocked<TypeRegistry>;
// const mockLogger = {
//     info: jest.fn(),
//     error: jest.fn(),
// } as unknown as jest.Mocked<typeof Logger>;

// describe('chainInitialise', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     // console.error, console.log, and console.info are mocked to suppress console output during tests.
//     jest.spyOn(console, 'error').mockImplementation(() => {
//         //do nothing
//     });
//     jest.spyOn(console, 'log').mockImplementation(() => {
//         //do nothing
//     });
//     jest.spyOn(console, 'info').mockImplementation(() => {
//         //do nothing
//     });
//   });

//   it('should initialize the chain', async () => {
//     jest.spyOn(ApiPromise, 'create').mockResolvedValue(mockApiPromise);
//     jest.spyOn(mockTypeRegistry, 'register').mockImplementation(() => {
//         // mockTypeRegistry.register is mocked with an empty implementation as it just needs to be spied on.
//     });
//     jest.spyOn(mockWsProvider, 'on').mockImplementation(() => {
//         return () => {
//             // do nothing
//         };
//     });
//     mockApiPromise.on = jest.fn().mockImplementation(() => ({
//         isReady: Promise.resolve(mockApiPromise),
//         isReadyOrError: Promise.resolve(mockApiPromise),
//       }));
//     const result = await chainInitialise('controlName');

//     expect(result).toBe(mockApiPromise);
//     expect(mockTypeRegistry.register).toHaveBeenCalledWith({ EventData: {} });
//     expect(mockWsProvider.on).toHaveBeenCalledWith('disconnected', expect.any(Function));
//     expect(mockApiPromise.on).toHaveBeenCalledWith('disconnected', expect.any(Function));
//     expect(mockLogger.info).toHaveBeenCalledWith('Chain initialised: controlName');
//     expect(mockLogger.error).not.toHaveBeenCalled();
//   });

//   it('should handle error when initializing the chain', async () => {
//     jest.spyOn(ApiPromise, 'create').mockRejectedValue(new Error('Connection error'));

//     expect(mockLogger.error).toHaveBeenCalledWith('API Error: Connection error');
//   });
// });

describe('nullValidation', () => {
   it('should return null if value is "system.null"', () => {
      const result = nullValidation(system.null);
      expect(result).toBeNull();
   });

   it('should return null if value is "system.nan"', () => {
      const result = nullValidation(system.nan);
      expect(result).toBeNull();
   });

   it('should return string if value is 0', () => {
      const result = nullValidation(0);
      expect(result).toBe('0');
   });

   it('should return string if value is a non-empty string', () => {
      const result = nullValidation('value');
      expect(result).toBe('value');
   });

   it('should return null if value is an empty string', () => {
      const result = nullValidation('');
      expect(result).toBeNull();
   });

   it('should return null for undefined', () => {
      const result = nullValidation(undefined);
      expect(result).toBeNull();
   });

   it('should return null for null', () => {
      const result = nullValidation(null);
      expect(result).toBeNull();
   });
});

describe('numberToString', () => {
   it('should return string representation of the number', () => {
      const result = numberToString(10);
      expect(result).toBe('10');
   });

   it('should return "0" if value is falsy', () => {
      const result = numberToString('');
      expect(result).toBe('0');
   });

   it('should return "0" if value is null', () => {
      const result = numberToString(null);
      expect(result).toBe('0');
   });

   it('should return "0" if value is undefined', () => {
      const result = numberToString(undefined);
      expect(result).toBe('0');
   });
});
