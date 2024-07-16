interface EventData {
   _id: ObjectId;
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
   eventExpireTime: string;
   createdAt: Date;
   updatedAt: Date;
   eventResultTime?: string;
   settlement?: string;
   __v: number;
}

// Assuming ObjectId is a specific type, you may need to define or import it accordingly
type ObjectId = any; // Replace with actual type definition if available

export { EventData };
