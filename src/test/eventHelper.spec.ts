import axios from 'axios';
const Sentry = require('@sentry/node');
// import Events from '../models/Events/index';
import timeStampToString from '../helpers/commom.helper';
import saveEvent from '../helpers/event.helper'; // Adjust path as needed
// import { resolutionSource } from '../utils/constant.util';

// Mock environment variables
process.env.IPFSURL = 'http://mocked-ipfs-url/';

jest.mock('axios');
jest.mock('@sentry/node');
// jest.mock('../models/Events/index');
jest.mock('../helpers/commom.helper');

describe('saveEvent', () => {
   const mockItem = [
      {
         events: [
            { value: 'event123' }, // eventId
            { value: 'user456' }, // userId
            { value: 3600 }, // eventDuration
            { value: 1650000000 }, // targetDateTime (timestamp)
            { value: 1650003600 }, // bettingClosureTime (timestamp)
         ],
      },
   ];

   const txnHash = '0xTransactionHash';

   beforeEach(() => {
      (axios.get as jest.Mock).mockImplementation(() =>
         Promise.resolve({
            data: {
               price: 100,
               name: 'ETH',
               description: 'Sample Event Description',
            },
         })
      );

      jest
         .fn()
         .mockImplementation((timestamp: number) =>
            new Date(timestamp).toISOString()
         );
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   // it('should save the event successfully', async () => {
   //   const saveMock = jest.fn().mockResolvedValue({
   //     _id: 'mockedEventId',
   //     ...mockItem[0].events,
   //   });
   //   jest.fn().mockImplementation(() => ({ save: saveMock }));

   //   const result = await saveEvent(mockItem, txnHash);

   //   expect(result._id).toBe('mockedEventId');
   //   expect(axios.get).toHaveBeenCalledWith(
   //     `${process.env.IPFSURL}${mockItem[0]?.events[0]?.value}`
   //   );
   //   expect(saveMock).toHaveBeenCalledWith();
   //   expect(timeStampToString).toHaveBeenCalledTimes(2);
   //   expect(timeStampToString).toHaveBeenCalledWith(
   //     Number(mockItem[0].events[3].value) * 1000
   //   );
   //   expect(timeStampToString).toHaveBeenCalledWith(
   //     Number(mockItem[0].events[4].value) * 1000
   //   );
   // },50000);

   it('should capture an exception and return error on failure', async () => {
      const error = new Error('Mocked Error');
      (axios.get as jest.Mock).mockRejectedValueOnce(error);

      const result = await saveEvent(mockItem, txnHash);

      expect(result).toBe(error);
      expect(Sentry.captureException).toHaveBeenCalledWith(error);
   });
});
