class BlockHelper {
   getLastSavedBlockdb = async (Block: any, blockNumber: number) => {
      try {
         await Block.syncDB((err: Error) => {
            if (err) throw err;
         });

         const result: any = await Block.findAsync(
            {
               id: 'Block',
               bnumber: { $lte: blockNumber },
               $limit: 1,
            },
            {
               allow_filtering: true,
               raw: true,
            }
         );

         if (result && result.length >= 1) {
            return result[result.length - 1].bnumber;
         } else {
            return blockNumber - 1;
         }
      } catch (err: any) {
         Sentry.captureException(err);

         return err;
      }
   };
}

export default new BlockHelper();
