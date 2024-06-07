interface Transaction {
   from: Array<any>;
   to: Array<any>;
   value: string;
   txnHash: string;
   tokenId: Array<any>;
   block_number: number;
   reason: string;
   sectionmethod: Array<any>;
   status: string;
   contractAddress: string;
   txfee: string;
   count: number;
   timestamp: string;
}

export { Transaction };
