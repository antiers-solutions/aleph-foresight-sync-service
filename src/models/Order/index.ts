import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
   bidType: string;
   orderType: boolean;
   amount: number;
   eventId: string;
   userId: string;
   fees: number;
   txnId: string;
   createdAt: Date;
   updatedAt: Date;
   currentBet: number;
   result: number;
   settlement: string;
}

const orderSchema: Schema<IOrder> = new Schema(
   {
      bidType: { type: String },
      orderType: { type: Boolean },
      amount: { type: Number },
      eventId: { type: String },
      currentBet: { type: Number },
      userId: { type: String },
      fees: { type: Number },
      txnId: { type: String },
      result: { type: Number, default: 0 },
      settlement: { type: String },
   },

   {
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
   }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
