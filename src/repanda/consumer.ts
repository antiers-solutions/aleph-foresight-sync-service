import { Kafka } from 'kafkajs';
import Events from '../models/Events/index';
import { v4 as uuidv4 } from 'uuid';
import timeStampToString from '../helpers/commom.helper';
import { EventData } from '../interfaces/consumer.interfaces';
import Currency from '../models/Currency/index';
import resultCall from '../helpers/consumer.helper';

const redpanda = new Kafka({
   brokers: ['localhost:19092'],
});
const consumer = redpanda.consumer({ groupId: uuidv4() });
export async function connect() {
   try {
      await consumer.connect();
      await consumer.subscribe({ topic: 'sync-service' });
      await consumer.run({
         eachMessage: async ({ topic, partition, message }) => {
            const formattedValue = JSON.parse(
               (message.value as Buffer).toString()
            );

            switch (formattedValue.user) {
               case 'closeEvent':
                  await Events.findOneAndUpdate(
                     { _id: formattedValue.message },
                     { status: 0 }
                  );
                  break;
               case 'getResults':
                  try {
                     const event: EventData = await Events.findOne({
                        eventId: formattedValue.message,
                     });
                     const time: number | string = timeStampToString(
                        Number(+event?.targetDateTime + 120) * 1000
                     );
                     const data: EventData = await Events.findOneAndUpdate(
                        {
                           eventId: formattedValue.message,
                        },
                        {
                           eventResultTime: time,
                        }
                     );
                     console.log('working ====> ', data);
                  } catch (error) {
                     console.log('error : ', error);
                  }
                  break;
               case 'eventResult':
                  try {
                     const event: EventData = await Events.findOne({
                        eventId: formattedValue.message,
                     });
                     const currencyData = await Currency.findOne({
                        symbol: event.currencyType,
                     });
                     console.log('=====> currencyData: ', currencyData);
                     let result: string = 'Yes';
                     currencyData.price > event.priceLevel
                        ? (result = 'No')
                        : (result = 'Yes');
                     console.log('result : ', result);
                     await resultCall(event.eventId, result);
                  } catch (error) {
                     console.log('error : ', error);
                  }
                  break;
               default:
                  break;
            }
         },
      });
   } catch (error) {
      console.log('Error:', error);
   }
}
export async function disconnect() {
   try {
      await consumer.disconnect();
   } catch (error) {
      console.error('Error:', error);
   }
}
