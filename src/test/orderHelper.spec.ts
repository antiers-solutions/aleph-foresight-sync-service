import saveOrder from '../helpers/order.helper'; // Adjust the import path
import Order from '../models/Order/index';
import * as Sentry from '@sentry/node';
import { errorLog, orderTypes } from '../utils/constant.util';

jest.mock('../models/Order/index'); // Mock the Order model
jest.mock('@sentry/node'); // Mock Sentry for error logging
jest.mock('../utils/constant.util', () => ({
   errorLog: jest.fn(), // Mock the errorLog function
   orderTypes: {
      yes: 'yes',
      no: 'no',
   },
}));

describe('saveOrder', () => {
   const mockItem = [
      {
         events: [
            { value: 'eventId' }, // events[0]
            { value: 'userId' }, // events[1]
            { value: 'yes' }, // events[2] - used for bidType and orderType
            { value: 100 }, // events[3]
            { value: 50 }, // events[4]
         ],
      },
   ];
   const mockTxnHash = 'mockTxnHash';

   beforeEach(() => {
      jest.clearAllMocks(); // Clear mock call history before each test
   });

   it('should save order successfully when valid data is provided', async () => {
      const mockSave = jest.fn().mockResolvedValue(undefined); // Mock the save method
      (Order as unknown as jest.Mock).mockImplementation(() => ({
         save: mockSave,
      }));

      await saveOrder(mockItem, mockTxnHash);

      // Expect Order to be called with the correct data
      expect(Order).toHaveBeenCalledWith({
         bidType: true,
         eventId: 'eventId',
         userId: 'userId',
         txnId: mockTxnHash,
         amount: 100,
         currentBet: 50,
         fees: 5,
         orderType: true,
      });

      // Retrieve the instance created by Order
      // const orderInstance = (Order as unknown as jest.Mock).mock.instances[0];

      // Check if save was called on that instance
      // expect(orderInstance.save).toHaveBeenCalled();
   });

   it('should call Sentry and log error when an error occurs during save', async () => {
      const mockError = new Error('Save error');
      (Order as unknown as jest.Mock).mockImplementation(() => ({
         save: jest.fn().mockRejectedValue(mockError), // Simulate save error
      }));

      await saveOrder(mockItem, mockTxnHash);

      // Expect Sentry to capture the exception
      expect(Sentry.captureException).toHaveBeenCalledWith(mockError);
      // Expect errorLog to be called
      expect(errorLog).toHaveBeenCalledWith(mockError);
   });

   it('should handle case where events[2] value is "no"', async () => {
      const modifiedMockItem = [
         {
            events: [
               { value: 'eventId' },
               { value: 'userId' },
               { value: 'no' }, // Change to "no"
               { value: 100 },
               { value: 50 },
            ],
         },
      ];

      (Order as unknown as jest.Mock).mockImplementation(() => ({
         save: jest.fn().mockResolvedValue(undefined),
      }));

      await saveOrder(modifiedMockItem, mockTxnHash);

      // Expect Order to be called with bidType and orderType as false
      expect(Order).toHaveBeenCalledWith({
         bidType: false,
         eventId: 'eventId',
         userId: 'userId',
         txnId: mockTxnHash,
         amount: 100,
         currentBet: 50,
         fees: 5,
         orderType: false,
      });
   });
});
