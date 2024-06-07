interface SingleContract {
   source: {
      hash: string;
      language: string;
      compiler: string;
      wasm: string;
   };
   contract: {
      name: string;
      version: string;
      authors: Array<string>;
   };
   V1: any;
}
interface BatchContract {
   source: {
      hash: string;
      language: string;
      compiler: string;
      wasm: string;
   };
   contract: {
      name: string;
      version: string;
      authors: Array<string>;
   };
   V1: any;
}
export { SingleContract, BatchContract };
