interface Entries {
   key?: string;
   value?: object;
}

interface LogsStructure {
   logs: [
      { PreRuntime?: object[] },
      { Consensus?: object[] },
      { Seal?: object[] }
   ];
}

interface LogsMap {
   logs: {
      registry?: object;
      initialU8aLength?: number;
      toHuman?: () => void;
   }[];
   initialU8aLength?: number;
   registry?: object;
}

export { Entries, LogsStructure, LogsMap };
