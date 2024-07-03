import mongoose, { Document, Schema } from 'mongoose';

export interface Block extends Document {
   hash: string;
   number: number;
   size: number;
   timeStamp: number;
   gasUsed: number;
}

const blockSchema: Schema<Block> = new Schema(
   {
      hash: { type: String },
      number: { type: Number },
      size: { type: Number },
      timeStamp: { type: Number },
      gasUsed: { type: Number },
   },

   {
      timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
   }
);

const Block = mongoose.model<Block>('Block', blockSchema);

export default Block;
