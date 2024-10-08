import { Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/node';
import '../connection';
import Events from '../models/Events/index';
import timeStampToString from '../helpers/commom.helper';
import { EventData } from '../interfaces/consumer.interfaces';
import Currency from '../models/Currency/index';
<<<<<<< HEAD
import { resultCall, getEventResult } from '../helpers/consumer.helper';
=======
import {
   resultCall,
   getEventResult,
   eventOdds,
   eventCreationFees,
} from '../helpers/consumer.helper';
>>>>>>> fb9ad29 (version 0.0.3 :Update platformfee.)
import { errorLog, kafka, orderTypes } from '../utils/constant.util';
import Order from '../models/Order';

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
<<<<<<< HEAD
                  await Events.findOneAndUpdate(
                     { _id: formattedValue.message },
                     { status: 0 }
                  );
=======
                  {
                     const getEventId = await Events.findOne({
                        _id: formattedValue.message,
                     });
                     const eventOdd = await eventOdds(getEventId.eventId);
                     const eventFees = await eventCreationFees(
                        getEventId.eventId
                     );
                     await Events.findOneAndUpdate(
                        { _id: formattedValue.message },
                        { status: 0, odds: eventOdd, platformFees: eventFees }
                     );
                  }
>>>>>>> fb9ad29 (version 0.0.3 :Update platformfee.)
                  break;
               case kafka.disputeClose:
                  await Events.findOneAndUpdate(
                     { eventId: formattedValue.message },
                     { status: 4 }
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
                     const timeCloserDispute: number | string =
                        timeStampToString(
                           Number(+event?.targetDateTime + 180) * 1000
                        );
                     const currencyData = await Currency.findOne({
                        symbol: event.currencyType,
                     });

                     let result: string = orderTypes.yes;

                     currencyData.price <= event.priceLevel
                        ? (result = orderTypes.no)
                        : (result = orderTypes.yes);
                     const eventResult = await getEventResult(event?.eventId);
                     if (eventResult[0] != '0' && eventResult[1] != '0') {
                        await Events.findOneAndUpdate(
                           {
                              eventId: formattedValue.message,
                           },
                           {
                              eventResultTime: time,
                              disputeCloserTime: timeCloserDispute,
                              settlement: result,
                           }
                        );
                     }
                  } catch (error) {
                     Sentry.captureException(error);
                  }
                  break;
               case kafka.closeBid:
                  try {
                     const event: EventData = await Events.findOne({
                        eventId: formattedValue.message,
                     });
                     const eventResult = await getEventResult(event?.eventId);
                     if (eventResult[0] != '0' && eventResult[1] != '0') {
                        await Events.updateOne(
                           { eventId: formattedValue.message },
                           { status: 3 }
                        );
                     }
                  } catch (error) {
                     Sentry.captureException(error);
                  }
                  break;
               case kafka.eventResult:
                  try {
                     const event: EventData = await Events.findOne({
                        eventId: formattedValue.message,
                     });
                     const eventResult = await getEventResult(event?.eventId);
                     if (eventResult[0] != '0' && eventResult[1] != '0') {
                        await Order.updateMany(
                           { eventId: formattedValue.message },
                           { settlement: event.settlement }
                        );

                        const data = await resultCall(
                           event.eventId,
                           event.settlement
                        );
                     }
                  } catch (error) {
                     Sentry.captureException(error);

                     errorLog(error);
                  }
                  break;
               default:
                  break;
            }
         },
      });
   } catch (error) {
      Sentry.captureException(error);

      errorLog(error);
   }
}
export async function disconnect() {
   try {
      await consumer.disconnect();
   } catch (error) {
      Sentry.captureException(error);
      errorLog(error);
   }
}
