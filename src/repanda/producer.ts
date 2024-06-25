import { Kafka } from 'kafkajs';
import '../connection';
import { errorLog, kafka } from '../utils/constents.util';
const redpanda = new Kafka({
   brokers: [process.env.KAFKA_URL],
});
const producer = redpanda.producer();
export async function getConnection(user: string) {
   try {
      await producer.connect();
      return async (message: string) => {
         await producer.send({
            topic: kafka.syncService,
            messages: [{ value: JSON.stringify({ message, user }) }],
         });
      };
   } catch (error) {
      errorLog(error);
   }
}
export async function disconnect() {
   try {
      await producer.disconnect();
   } catch (error) {
      errorLog(error);
   }
}
