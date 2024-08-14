import BlockHelper from '../helpers/block.helper';

describe('BlockHelper', () => {
   let mockBlock: any;

   beforeEach(() => {
      mockBlock = {
         syncDB: jest.fn(),
         findAsync: jest.fn(),
      };
   });

   test('should return the last saved block number when records are found', async () => {
      const blockNumber = 5;
      const mockResult = [{ id: 'Block', bnumber: 4 }];

      mockBlock.syncDB.mockImplementation(
         (callback: (err: Error | null) => void) => callback(null)
      );
      mockBlock.findAsync.mockResolvedValue(mockResult);

      const result = await BlockHelper.getLastSavedBlockdb(
         mockBlock,
         blockNumber
      );

      expect(result).toBe(4);
      expect(mockBlock.syncDB).toHaveBeenCalled();
      expect(mockBlock.findAsync).toHaveBeenCalledWith(
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
   });

   test('should return blockNumber - 1 when no records are found', async () => {
      const blockNumber = 5;

      mockBlock.syncDB.mockImplementation(
         (callback: (err: Error | null) => void) => callback(null)
      );
      mockBlock.findAsync.mockResolvedValue([]);

      const result = await BlockHelper.getLastSavedBlockdb(
         mockBlock,
         blockNumber
      );

      expect(result).toBe(blockNumber - 1);
      expect(mockBlock.syncDB).toHaveBeenCalled();
      expect(mockBlock.findAsync).toHaveBeenCalledWith(
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
   });

   test('should handle errors from syncDB', async () => {
      const error = new Error('Sync error');
      mockBlock.syncDB.mockImplementation(
         (callback: (err: Error | null) => void) => callback(error)
      );

      const result = await BlockHelper.getLastSavedBlockdb(mockBlock, 5);

      expect(result).toEqual(error); // Updated assertion to use toEqual
      expect(mockBlock.syncDB).toHaveBeenCalled();
      expect(mockBlock.findAsync).not.toHaveBeenCalled();
   });

   test('should handle errors from findAsync', async () => {
      const syncDBMock = jest
         .fn()
         .mockImplementation((callback: (err: Error | null) => void) =>
            callback(null)
         );
      const findAsyncError = new Error('Find async error');
      mockBlock.syncDB = syncDBMock;
      mockBlock.findAsync.mockRejectedValue(findAsyncError);

      const result = await BlockHelper.getLastSavedBlockdb(mockBlock, 5);

      expect(result).toEqual(findAsyncError); // Updated assertion to use toEqual
      expect(mockBlock.syncDB).toHaveBeenCalled();
      expect(mockBlock.findAsync).toHaveBeenCalled();
   });
});
