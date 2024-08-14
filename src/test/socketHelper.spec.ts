import { connections, socketSuccess } from '../utils/constant.util';
import { Logger } from '../logger';
import SocketHelper from '../helpers/socket.helper'; // Ensure correct path

jest.mock('../utils/constant.util');
jest.mock('../logger');

describe('SocketHelper', () => {
   let ioMock: any;
   let socketHelper: SocketHelper;

   beforeEach(() => {
      ioMock = {
         on: jest.fn().mockReturnThis(), // Chainable mock for `on` method
      };

      // Create an instance of SocketHelper with the mocked `io`
      socketHelper = new SocketHelper(ioMock);
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('should initialize and call checkConnection', () => {
      // Check that `on` is called twice with the correct arguments
      expect(ioMock.on).toHaveBeenCalledTimes(2);
      expect(ioMock.on).toHaveBeenCalledWith(
         connections.connection,
         expect.any(Function)
      );
      expect(ioMock.on).toHaveBeenCalledWith(
         connections.error,
         expect.any(Function)
      );
   });

   it('should log socketSuccess on connection', () => {
      // Extract the connection callback and invoke it
      const connectionCallback = ioMock.on.mock.calls.find(
         (call: any[]) => call[0] === connections.connection
      )?.[1];
      if (typeof connectionCallback === 'function') {
         connectionCallback(); // Trigger the connection callback
      } else {
         throw new Error('Connection callback is not a function');
      }

      expect(Logger.info).toHaveBeenCalledWith(socketSuccess);
   });

   it('should log error message on error', () => {
      const error = new Error('Mocked Error');
      // Extract the error callback and invoke it with an error
      const errorCallback = ioMock.on.mock.calls.find(
         (call: any[]) => call[0] === connections.error
      )?.[1];
      if (typeof errorCallback === 'function') {
         errorCallback(error); // Trigger the error callback
      } else {
         throw new Error('Error callback is not a function');
      }

      expect(Logger.error).toHaveBeenCalledWith(
         `${connections.error} ${error}`
      );
   });
});
