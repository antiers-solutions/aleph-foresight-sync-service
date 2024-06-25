interface TransactionInfo {
   block_number: number | null;
   txnHash: string;
   status: string; // Assuming status can only be 'pending'
   reason: null | any; // Adjust the type of reason accordingly
   sectionmethod: string;
   from: string | null;
   to: string | null;
   contractAddress: string | null; // Assuming contractAddress is a string
   timestamp: string; // Assuming timestamp is always a string representation of time
   tokenId: null; // Assuming tokenId is always null based on the snippet
   txfee: string | null; // Assuming txfee is a string or null
   value?: string | null | number; // Assuming value is a number or null
   count: number; // Assuming count is always a number
}

interface EventInterface {
   data?: {
      log?: {
         data?: string; // Assuming data can be of any type
         topics?: string[];
      };
   };
}

interface EventInterfaceInfo {
   data?: {
      log?: {
         topics?: (string | number | bigint | object)[]; // Assuming topics can contain strings, numbers, or bigints
      };
   };
}

export { TransactionInfo, EventInterface, EventInterfaceInfo };
