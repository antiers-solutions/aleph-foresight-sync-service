const timeStampToString = (timestamp: string | number): string => {
   const data = new Date(timestamp);
   // Helper function to pad single digit numbers with leading zero
   const pad = (num: any) => num.toString().padStart(2, '0');

   // Extract date components
   const day = data.getDate();
   const month = pad(data.getMonth() + 1); // Months are zero-indexed
   const year = data.getFullYear().toString().slice(-2); // Get last two digits of year
   const hours = pad(data.getHours());
   const minutes = pad(data.getMinutes());

   // Format the date
   const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
   return formattedDate;
};

export default timeStampToString;
