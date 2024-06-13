import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
   orderType: boolean;
   amount: number;
   eventId: string;
   userId: string;
   fees: number;
   txnId: string;
   createdAt: Date;
   updatedAt: Date;
}

const orderSchema: Schema<IOrder> = new Schema(
   {
      orderType: { type: Boolean },
      amount: { type: Number },
      eventId: { type: String },
      userId: { type: String },
      fees: { type: Number },
      txnId: { type: String },
   },

   {
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
   }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
