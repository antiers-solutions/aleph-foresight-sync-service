import SocketEventEmitter from '../helpers/socketEvent.helper'; // Adjust path as needed

describe('SocketEventEmitter', () => {
   beforeEach(() => {
      // Mock the global.socket object
      (global as any).socket = {
         emit: jest.fn(), // Mock the emit method
      };
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('should emit message with the correct event name and data', () => {
      const eventName = 'testEvent';
      const data = { key: 'value' };

      SocketEventEmitter.emitMessage(eventName, data);

      // Verify that global.socket.emit is called with the correct parameters
      expect((global as any).socket.emit).toHaveBeenCalledWith(eventName, data);
   });

   it('should handle emitting with different event names and data', () => {
      const eventName = 'anotherEvent';
      const data = { anotherKey: 'anotherValue' };

      SocketEventEmitter.emitMessage(eventName, data);

      // Verify that global.socket.emit is called with the correct parameters
      expect((global as any).socket.emit).toHaveBeenCalledWith(eventName, data);
   });
});
