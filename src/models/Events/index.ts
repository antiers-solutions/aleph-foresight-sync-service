import mongoose, { Document, Schema } from 'mongoose';

export interface IEvents extends Document {
   eventId: string;
   txnId: string;
   userId: string;
   currencyType: string;
   priceLevel: number;
   targetDateTime: string;
   bettingClosureTime: string;
   eventDuration: string;
   description: string;
   platformFees: number;
   minimumBetFees: number;
   maximumBetFees: number;
   resolutionSource: string;
   resolver: string;
   status: boolean;
   createdAt: Date;
   updatedAt: Date;
   eventExpireTime: string;
}

const eventsSchema: Schema<IEvents> = new Schema(
   {
      eventId: { type: String },
      txnId: { type: String },
      userId: { type: String },
      currencyType: { type: String },
      priceLevel: { type: Number },
      targetDateTime: { type: String },
      bettingClosureTime: { type: String },
      eventDuration: { type: String },
      description: { type: String },
      platformFees: { type: Number },
      minimumBetFees: { type: Number },
      maximumBetFees: { type: Number },
      resolutionSource: { type: String },
      resolver: { type: String },
      status: { type: Boolean },
      eventExpireTime: { type: String },
   },

   {
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
   }
);

const Events = mongoose.model<IEvents>('Events', eventsSchema);

export default Events;
