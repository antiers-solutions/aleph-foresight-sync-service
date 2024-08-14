import timeStampToString from '../helpers/commom.helper';

describe('timeStampToString', () => {
   it('should format a valid timestamp correctly', () => {
      const timestamp = new Date('2024-08-05T14:30:00').getTime();
      expect(timeStampToString(timestamp)).toBe('5-08-24 14:30');
   });

   it('should handle single-digit days and months correctly', () => {
      const timestamp = new Date('2024-01-01T05:05:00').getTime();
      expect(timeStampToString(timestamp)).toBe('1-01-24 05:05');
   });

   it('should handle string timestamp input correctly', () => {
      const timestamp = '2024-08-05T14:30:00';
      expect(timeStampToString(timestamp)).toBe('5-08-24 14:30');
   });

   it('should handle edge cases at the end of the month', () => {
      const timestamp = new Date('2024-08-31T23:59:00').getTime();
      expect(timeStampToString(timestamp)).toBe('31-08-24 23:59');
   });

   it('should return "Invalid Date" for invalid timestamps', () => {
      const invalidTimestamp = 'invalid-date';
      expect(timeStampToString(invalidTimestamp)).toBe('NaN-NaN-aN NaN:NaN');
   });
});
