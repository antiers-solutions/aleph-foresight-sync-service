import { Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import '../connection';
import Events from '../models/Events/index';
import timeStampToString from '../helpers/commom.helper';
import { EventData } from '../interfaces/consumer.interfaces';
import Currency from '../models/Currency/index';
import resultCall from '../helpers/consumer.helper';
import { errorLog, kafka, orderTypes } from '../utils/constant.util';

const redpanda = new Kafka({
   brokers: [process.env.KAFKA_URL],
});
const consumer = redpanda.consumer({ groupId: uuidv4() });
export async function connect() {
   try {
      await consumer.connect();
      await consumer.subscribe({ topic: kafka.syncService });
      await consumer.run({
         eachMessage: async ({ topic, partition, message }) => {
            const formattedValue = JSON.parse(
               (message.value as Buffer).toString()
            );

            switch (formattedValue.user) {
               case kafka.closeEvent:
                  await Events.findOneAndUpdate(
                     { _id: formattedValue.message },
                     { status: 0 }
                  );
                  break;
               case kafka.getResults:
                  try {
                     const event: EventData = await Events.findOne({
                        eventId: formattedValue.message,
                     });
                     const time: number | string = timeStampToString(
                        Number(+event?.targetDateTime + 60) * 1000
                     );
                     const data: EventData = await Events.findOneAndUpdate(
                        {
                           eventId: formattedValue.message,
                        },
                        {
                           eventResultTime: time,
                        }
                     );

                     console.log('\n');
                     console.log('getResults : ', data);
                     console.log('\n');
                  } catch (error) {}
                  break;
               case kafka.eventResult:
                  try {
                     const event: EventData = await Events.findOne({
                        eventId: formattedValue.message,
                     });
                     const currencyData = await Currency.findOne({
                        symbol: event.currencyType,
                     });
                     let result: string = orderTypes.yes;
                     currencyData.price > event.priceLevel
                        ? (result = orderTypes.no)
                        : (result = orderTypes.yes);
                     const data = await resultCall(event.eventId, result);
                     console.log('\n');
                     console.log('eventResult : ', data);
                     console.log('\n');
                  } catch (error) {
                     errorLog(error);
                  }
                  break;
               default:
                  break;
            }
         },
      });
   } catch (error) {
      errorLog(error);
   }
}
export async function disconnect() {
   try {
      await consumer.disconnect();
   } catch (error) {
      errorLog(error);
   }
}
