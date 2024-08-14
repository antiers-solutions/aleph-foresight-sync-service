import { Response } from 'express';
import ResponseHelper from '../responses/response.helper'; // Adjust the import path as necessary
import { ESResponse } from '../interfaces';

describe('ResponseHelper', () => {
   let mockResponse: Partial<Response>;

   beforeEach(() => {
      mockResponse = {
         status: jest.fn().mockReturnThis(),
         send: jest.fn().mockReturnThis(),
      };
   });

   describe('success', () => {
      it('should send a 200 status with the provided response data', () => {
         const responseData: ESResponse = { message: 'Success', status: 200 };

         ResponseHelper.success(mockResponse as Response, responseData);

         expect(mockResponse.status).toHaveBeenCalledWith(200);
         expect(mockResponse.send).toHaveBeenCalledWith(responseData);
      });

      it('should send a 200 status with an empty object if no response data is provided', () => {
         ResponseHelper.success(mockResponse as Response);

         expect(mockResponse.status).toHaveBeenCalledWith(200);
         expect(mockResponse.send).toHaveBeenCalledWith({});
      });
   });

   describe('error', () => {
      it('should send a 500 status and the error message if no status is provided', () => {
         const responseData: ESResponse = { message: 'Internal Server Error' };

         ResponseHelper.error(mockResponse as Response, responseData);

         expect(mockResponse.status).toHaveBeenCalledWith(500);
         expect(mockResponse.send).toHaveBeenCalledWith({
            message: responseData.message,
         });
      });

      it('should send the provided status and error message', () => {
         const responseData: ESResponse = {
            message: 'Bad Request',
            status: 400,
         };

         ResponseHelper.error(mockResponse as Response, responseData);

         expect(mockResponse.status).toHaveBeenCalledWith(400);
         expect(mockResponse.send).toHaveBeenCalledWith({
            message: responseData.message,
         });
      });

      it('should handle missing responseData and default to 500 status with an undefined message', () => {
         ResponseHelper.error(mockResponse as Response);

         expect(mockResponse.status).toHaveBeenCalledWith(500);
         expect(mockResponse.send).toHaveBeenCalledWith({ message: undefined });
      });
   });
});
