export interface GlobalObject {
   global: GlobalObject; // Circular reference to itself
   queueMicrotask?: (callback: () => void) => void;
   clearImmediate?: (immediateId: number) => void;
   setImmediate?: {
      (handler?: (...args: any[]) => void): number;
   };
   structuredClone?: (input: any) => any;
   clearInterval?: (intervalId: NodeJS.Timeout) => void;
   clearTimeout?: (timeoutId: NodeJS.Timeout) => void;
   setInterval?: {
      (
         handler: (...args: any[]) => void,
         timeout?: number,
         ...args: any[]
      ): NodeJS.Timeout;
   };
   setTimeout?: {
      (
         handler: (...args: any[]) => void,
         timeout?: number,
         ...args: any[]
      ): NodeJS.Timeout;
   };
   atob?: {
      get: () => any;
      set: (value: any) => void;
   };
   btoa?: {
      get: () => any;
      set: (value: any) => void;
   };
   performance?: {
      get: () => any;
      set: (value: any) => void;
   };
   fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
   __polkadotjs: {
      '@polkadot/util': object[];
      '@polkadot/api': object[];
      '@polkadot/rpc-augment': object[];
      '@polkadot/keyring': object[];
      '@polkadot/util-crypto': object[];
      '@polkadot/wasm-crypto': object[];
      '@polkadot/wasm-bridge': object[];
      '@polkadot/wasm-crypto-wasm': object[];
      '@polkadot/wasm-util': object[];
      '@polkadot/rpc-provider': object[];
      '@polkadot/api-derive': object[];
      '@polkadot/rpc-core': object[];
      '@polkadot/types': object[];
      '@polkadot/types-create': object[];
      '@polkadot/types-codec': object[];
      '@polkadot/types-known': object[];
   };
   scheduledTasks?: Map<any, any>;
}

export interface InfoInterface {
   timestamp?: number;
   level?: number;
   message?: string;
}
