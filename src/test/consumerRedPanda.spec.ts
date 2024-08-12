// import { Kafka, EachMessagePayload } from 'kafkajs';
// import { connect, disconnect } from '../repanda/consumer'; // Adjust the import path as necessary
// import Events from '../models/Events';
// import Currency from '../models/Currency';
// import Order from '../models/Order';
// import * as consumerHelper from '../helpers/consumer.helper';
// const Sentry = require('@sentry/node');

// jest.mock('kafkajs');
// jest.mock('../models/Events');
// jest.mock('../models/Currency');
// jest.mock('../models/Order');
// jest.mock('../helpers/consumer.helper');
// jest.mock('@sentry/node');

// describe('Kafka Consumer', () => {
//   let consumerMock: any;

//   beforeEach(() => {
//     consumerMock = {
//       connect: jest.fn().mockResolvedValue(undefined),
//       disconnect: jest.fn().mockResolvedValue(undefined),
//       subscribe: jest.fn().mockResolvedValue(undefined),
//       run: jest.fn(),
//     };

//     Kafka.prototype.consumer = consumerMock;
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('connect', () => {
//     it('should connect to Kafka and handle eachMessage', async () => {
//       const mockEachMessage = jest.fn();
//       consumerMock.run.mockImplementation(
//         ({
//           eachMessage,
//         }: {
//           eachMessage: (payload: EachMessagePayload) => Promise<void>;
//         }) => {
//           mockEachMessage(eachMessage);
//         }
//       );

//       // Mock data returned by model methods
//       Events.findOne = jest.fn().mockResolvedValue({
//         eventId: 'event1',
//         targetDateTime: Date.now(),
//         currencyType: 'USD',
//         priceLevel: 100,
//         settlement: 'yes',
//       });

//       Currency.findOne = jest.fn().mockResolvedValue({ price: 90 });
//       Order.updateMany = jest.fn();

//       jest
//         .spyOn(consumerHelper, 'getEventResult')
//         .mockResolvedValue(['1', '1']);
//       jest.spyOn(consumerHelper, 'eventOdds').mockResolvedValue(50);
//       jest.spyOn(consumerHelper, 'resultCall').mockResolvedValue(true);

//       await connect();

//       // Simulate message handling
//       const message = {
//         value: Buffer.from(
//           JSON.stringify({ user: 'getResults', message: 'event1' })
//         ),
//       };
//       await mockEachMessage({
//         topic: 'kafka.syncService',
//         partition: 0,
//         message,
//       });

//       expect(consumerMock.connect).toHaveBeenCalled();
//       expect(consumerMock.subscribe).toHaveBeenCalledWith({
//         topic: 'kafka.syncService',
//       });
//       expect(Events.findOne).toHaveBeenCalledWith({ eventId: 'event1' });
//       expect(Currency.findOne).toHaveBeenCalled();
//       expect(Order.updateMany).toHaveBeenCalled();
//       expect(Sentry.captureException).not.toHaveBeenCalled();
//     });

//     it('should handle errors and capture exceptions', async () => {
//       consumerMock.run.mockImplementation(
//         ({
//           eachMessage,
//         }: {
//           eachMessage: (payload: EachMessagePayload) => Promise<void>;
//         }) => {
//           eachMessage({
//             topic: 'syncService',
//             partition: 0,
//             message: {
//               value: Buffer.from(
//                 JSON.stringify({
//                   user: 'getResults',
//                   message: 'event1',
//                 })
//               ),
//             },
//           } as EachMessagePayload);
//         }
//       );

//       Events.findOne = jest
//         .fn()
//         .mockRejectedValue(new Error('Database error'));
//       Sentry.captureException = jest.fn();

//       await connect();

//       expect(Sentry.captureException).toHaveBeenCalled();
//     });
//   });

//   describe('disconnect', () => {
//     it('should disconnect from Kafka', async () => {
//       await disconnect();

//       expect(consumerMock.disconnect).toHaveBeenCalled();
//     });

//     it('should handle disconnection errors', async () => {
//       consumerMock.disconnect.mockRejectedValue(
//         new Error('Disconnect error')
//       );
//       Sentry.captureException = jest.fn();

//       await disconnect();

//       expect(Sentry.captureException).toHaveBeenCalled();
//     });
//   });
// });
