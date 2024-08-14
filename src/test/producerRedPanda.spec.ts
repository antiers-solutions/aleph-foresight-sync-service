// import { Kafka } from 'kafkajs';
// import { getConnection, disconnect } from '../repanda/producer'; // Adjust the import path as necessary
// const Sentry = require('@sentry/node');
// import { errorLog, kafka } from '../utils/constant.util';

// jest.mock('kafkajs');
// jest.mock('@sentry/node');
// jest.mock('../utils/constant.util');

// describe('Kafka Producer', () => {
//   let producerMock: any;

//   beforeEach(() => {
//     producerMock = {
//       connect: jest.fn().mockResolvedValue(undefined),
//       send: jest.fn().mockResolvedValue(undefined),
//       disconnect: jest.fn().mockResolvedValue(undefined),
//     };

//     (Kafka as jest.Mock).mockImplementation(() => ({
//       producer: () => producerMock,
//     }));
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('getConnection', () => {
//     it('should connect to Kafka and send a message', async () => {
//       const message = 'testMessage';
//       const user = 'testUser';

//       // Ensure getConnection returns a function
//       const connection = await getConnection(user);
//       if (connection) {
//         await connection(message);
//       }

//       expect(producerMock.connect).toHaveBeenCalled();
//       expect(producerMock.send).toHaveBeenCalledWith({
//         topic: kafka.syncService,
//         messages: [{ value: JSON.stringify({ message, user }) }],
//       });
//       expect(Sentry.captureException).not.toHaveBeenCalled();
//     });

//     it('should handle errors during connection', async () => {
//       const error = new Error('Connection error');
//       producerMock.connect.mockRejectedValue(error);

//       await expect(getConnection('testUser')).resolves.toBeUndefined();

//       // Ensure the connection function does not return a function if an error occurs
//       await expect(getConnection('testUser')).rejects.toThrow('Connection error');

//       expect(Sentry.captureException).toHaveBeenCalledWith(error);
//       expect(errorLog).toHaveBeenCalledWith(error);
//     });

//     it('should handle errors during message sending', async () => {
//       const error = new Error('Send error');
//       producerMock.send.mockRejectedValue(error);

//       const sendMessage = await getConnection('testUser');

//       if (sendMessage) {
//         await expect(sendMessage('testMessage')).rejects.toThrow('Send error');
//       } else {
//         fail('sendMessage is undefined');
//       }

//       expect(Sentry.captureException).toHaveBeenCalledWith(error);
//       expect(errorLog).toHaveBeenCalledWith(error);
//     });
//   });

//   describe('disconnect', () => {
//     it('should disconnect from Kafka', async () => {
//       await disconnect();

//       expect(producerMock.disconnect).toHaveBeenCalled();
//       expect(Sentry.captureException).not.toHaveBeenCalled();
//     });

//     it('should handle errors during disconnection', async () => {
//       const error = new Error('Disconnect error');
//       producerMock.disconnect.mockRejectedValue(error);

//       await expect(disconnect()).resolves.toBeUndefined();

//       expect(Sentry.captureException).toHaveBeenCalledWith(error);
//       expect(errorLog).toHaveBeenCalledWith(error);
//     });
//   });
// });
