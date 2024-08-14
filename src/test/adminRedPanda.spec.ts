// import { Kafka } from 'kafkajs';
// import { createTopic } from '../repanda/admin'; // Adjust the import path as necessary

// jest.mock('kafkajs');

// describe('createTopic', () => {
//    let adminMock: jest.Mocked<any>; // Use jest.Mocked<any> to ensure proper typing

//    const topicName = 'test-topic';

//    beforeEach(() => {
//       adminMock = {
//          connect: jest.fn().mockResolvedValue(undefined),
//          disconnect: jest.fn().mockResolvedValue(undefined),
//          listTopics: jest.fn(),
//          createTopics: jest.fn().mockResolvedValue(undefined),
//       } as jest.Mocked<any>; // Use jest.Mocked<any> for type assertion

//       (Kafka as jest.Mock).mockImplementation(() => ({
//          admin: () => adminMock,
//       }));
//    });

//    afterEach(() => {
//       jest.clearAllMocks();
//    });

//    it('should create a new topic if it does not exist', async () => {
//       adminMock.listTopics.mockResolvedValue([]);

//       await createTopic(topicName);

//       expect(adminMock.connect).toHaveBeenCalled();
//       expect(adminMock.listTopics).toHaveBeenCalled();
//       expect(adminMock.createTopics).toHaveBeenCalledWith({
//          topics: [
//             {
//                topic: topicName,
//                numPartitions: 1,
//                replicationFactor: 1,
//             },
//          ],
//       });
//       expect(adminMock.disconnect).toHaveBeenCalled();
//    });

//    it('should not create a topic if it already exists', async () => {
//       adminMock.listTopics.mockResolvedValue([topicName]);

//       await createTopic(topicName);

//       expect(adminMock.connect).toHaveBeenCalled();
//       expect(adminMock.listTopics).toHaveBeenCalled();
//       expect(adminMock.createTopics).not.toHaveBeenCalled();
//       expect(adminMock.disconnect).toHaveBeenCalled();
//    });

//    it('should use provided partitions and replication factors', async () => {
//       const partitions = 3;
//       const replicas = 2;

//       adminMock.listTopics.mockResolvedValue([]);

//       await createTopic(topicName, partitions, replicas);

//       expect(adminMock.connect).toHaveBeenCalled();
//       expect(adminMock.listTopics).toHaveBeenCalled();
//       expect(adminMock.createTopics).toHaveBeenCalledWith({
//          topics: [
//             {
//                topic: topicName,
//                numPartitions: partitions,
//                replicationFactor: replicas,
//             },
//          ],
//       });
//       expect(adminMock.disconnect).toHaveBeenCalled();
//    });

//    it('should handle errors gracefully', async () => {
//       adminMock.connect.mockRejectedValue(new Error('Connection failed'));

//       await expect(createTopic(topicName)).rejects.toThrow('Connection failed');

//       expect(adminMock.connect).toHaveBeenCalled();
//       expect(adminMock.disconnect).not.toHaveBeenCalled();
//    });
// });
