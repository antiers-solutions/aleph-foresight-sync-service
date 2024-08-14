// Import the module containing the exports
const constants = require('../responses/const.responses'); // Adjust the path as necessary

describe('Constants Module', () => {
   describe('STATUS Codes', () => {
      it('should have correct HTTP status codes', () => {
         expect(constants.STATUS.SUCCESS).toBe(200);
         expect(constants.STATUS.CREATED).toBe(201);
         expect(constants.STATUS.ACCEPTED).toBe(202);
         expect(constants.STATUS.NOCONTENT).toBe(204);
         expect(constants.STATUS.BADREQUEST).toBe(400);
         expect(constants.STATUS.UN_AUTHORIZED).toBe(401);
         expect(constants.STATUS.FORBIDDEN).toBe(403);
         expect(constants.STATUS.NOTFOUND).toBe(404);
         expect(constants.STATUS.TIMEOUT).toBe(408);
         expect(constants.STATUS.TOOMANYREQ).toBe(429);
         expect(constants.STATUS.INTERNALSERVER).toBe(500);
         expect(constants.STATUS.BADGATEWAYS).toBe(502);
         expect(constants.STATUS.SERVICEUNAVILABLE).toBe(503);
         expect(constants.STATUS.GATEWAYTIMEOUT).toBe(504);
      });
   });

   describe('Response Messages', () => {
      it('should have correct response messages', () => {
         expect(constants.RES_MSG.CREATEUSER).toBe('User created succesfully');
         expect(constants.RES_MSG.LOGSUCCESS).toBe(
            'User successfully logged in'
         );
         expect(constants.RES_MSG.USEREXIST).toBe('User already exist');
         expect(constants.RES_MSG.INVALIDLOG).toBe('Email/password is invalid');
         expect(constants.RES_MSG.NODOMAIN).toBe('No domain found');
         expect(constants.RES_MSG.DOMAINFOUND).toBe('Domain details found');
         expect(constants.RES_MSG.DOMAINBUY).toBe(
            'Domain purchased successful'
         );
         expect(constants.RES_MSG.CONTROLBUY).toBe(
            'Controller purchase successful'
         );
         expect(constants.RES_MSG.DOMAIN_OWNER).toBe(
            'You are not the owner of this domain'
         );
         expect(constants.RES_MSG.SEARCH_SUB_DOMAIN).toBe(
            'Searched all sub_domains'
         );
         expect(constants.RES_MSG.SEARCH_DOMAIN).toBe('Searched all domains');
         expect(constants.RES_MSG.NOSUB_DOMAIN).toBe('No sub domain found');
         expect(constants.RES_MSG.SUBDOMAIN_CON_DETAILS).toBe(
            'Sub domain controller details'
         );
         expect(constants.RES_MSG.TRANSFERFAIL).toBe('Transfer failed');
         expect(constants.RES_MSG.NOWALLET).toBe('No wallet found');
         expect(constants.RES_MSG.DOMAINTRANSFER).toBe(
            'Domain transfered successfully'
         );
         expect(constants.RES_MSG.INVALIDTOKENID).toBe('Invalid Token Id');
         expect(constants.RES_MSG.ADDRESSFETCH).toBe(
            'Address Fetched Successfully'
         );
         expect(constants.RES_MSG.BALANCEFETCH).toBe(
            'Balance Fetched Successfully'
         );
         expect(constants.RES_MSG.BLOCKFETCH).toBe(
            'Block Fetched Successfully'
         );
         expect(constants.RES_MSG.TRANSFERBALANCE).toBe(
            'Balance Transfered Successfully'
         );
         expect(constants.RES_MSG.BLOCKDETAIL).toBe(
            'Block Detail Fetched Successfully'
         );
         expect(constants.RES_MSG.ERROR).toBe(
            'Oops! Something went wrong. Please try again.'
         );
         expect(constants.RES_MSG.ALLBLOCKFETCH).toBe(
            'Block Fetched Successfully'
         );
         expect(constants.RES_MSG.VALIDHASH).toBe('Please Enter a Valid Hash');
         expect(constants.RES_MSG.TRASACTION).toBe(
            'Transaction Fetched Successfully'
         );
         expect(constants.RES_MSG.VALIDATORFETCH).toBe(
            'Validator Fetched Successfully'
         );
         expect(constants.RES_MSG.KEYFETCH).toBe('Key Fetch Successfully');
         expect(constants.RES_MSG.PREIMAGESUCCESS).toBe(
            'Pre Image Created Successfully'
         );
         expect(constants.RES_MSG.PROPOSALSUBMIT).toBe(
            'Proposal Submit Successfully'
         );
         expect(constants.RES_MSG.VOTESENT).toBe('Vote Sent Successfully');
         expect(constants.RES_MSG.DISPETCHFETCH).toBe(
            'Dispetch Fetched Successfully'
         );
         expect(constants.RES_MSG.BALANCETRANSFERED).toBe(
            'Balance Transfered Successfully'
         );
         expect(constants.RES_MSG.EXCEEDSBALANCE).toBe(
            'We could not transferred balance because you already have balance'
         );
         expect(constants.RES_MSG.TRANSACTIONFETCH).toBe(
            'Transaction fetch Successfully'
         );
         expect(constants.RES_MSG.BLOCKTRANSACTIONFETCH).toBe(
            'Block transactions fetched Successfully'
         );
         expect(constants.RES_MSG.APPROVEDFETCH).toBe(
            'Approved Fetch Successfully'
         );
         expect(constants.RES_MSG.OWNEROFFETCH).toBe(
            'Owner Of Fetch Successfully'
         );
         expect(constants.RES_MSG.INVALIDADDRESSS).toBe('Invalid Address');
         expect(constants.RES_MSG.MINTSUCCESS).toBe('Mint Successfully');
         expect(constants.RES_MSG.TOKENIDEXIST).toBe('Token Id already exist');
         expect(constants.RES_MSG.INVALIDRECIEVERACCOUNTID).toBe(
            'Invalid Reciever Account Id'
         );
         expect(constants.RES_MSG.FILEREQUIRED).toBe('Only 1 file is required');
         expect(constants.RES_MSG.BURNSUCCESS).toBe('Burn Successfully');
         expect(constants.RES_MSG.TRANSFERSUCCESS).toBe(
            'Transfer Successfully'
         );
         expect(constants.RES_MSG.INVALIDTOADDRESS).toBe('Invalid toAddress');
         expect(constants.RES_MSG.INVALIDACCOUNTID).toBe('Invalid Account Id');
         expect(constants.RES_MSG.INVALIDOPERATORID).toBe(
            'Invalid Operator Id'
         );
         expect(constants.RES_MSG.INVALIDOWNERID).toBe('Invalid Owner Id');
         expect(constants.RES_MSG.INVALIDFROMACCOUNT).toBe(
            'Invalid from Account Id'
         );
         expect(constants.RES_MSG.INVALIDTOACCOUNT).toBe(
            'Invalid to Account Id'
         );
         expect(constants.RES_MSG.APPROVESUCCESS).toBe('Approve Successfully');
         expect(constants.RES_MSG.APPROVALSET).toBe(
            'Approval Set Successfully'
         );
         expect(constants.RES_MSG.NFTFETCH).toBe('NFT Fetch Successfully');
         expect(constants.RES_MSG.INVALIDOWNERMNEMONICS).toBe(
            'Invali Nft Owner Mnemonics'
         );
         expect(constants.RES_MSG.NOTTRANSFERTOKEN).toBe(
            'You did not transfer the token to yourself'
         );
         expect(constants.RES_MSG.INVALIDFILESIZE).toBe('Invalid File Size');
         expect(constants.RES_MSG.FILEXIST).toBe(
            'File already exist,Please add unique file'
         );
         expect(constants.RES_MSG.INVALID_HASH).toBe('Hash is not valid');
         expect(constants.RES_MSG.SERVER_ERROR).toBe('Server Error');
         expect(constants.RES_MSG.NOT_FOUND).toBe('Not Found!');
         expect(constants.RES_MSG.BLOCKADDED).toBe('Block Added Successfully!');
         expect(constants.RES_MSG.UPDATED_SUCCESS).toBe(
            'Updated Successfully!'
         );
         expect(constants.RES_MSG.NOT_VALID_BLOCK_NUMBER).toBe(
            'Not Valid Block Number!'
         );
         expect(constants.RES_MSG.NOT_VALID_QUERY).toBe('Query is not Valid!');
         expect(constants.RES_MSG.INVALIDADDREASS).toBe('Invalid Address!');
         expect(constants.RES_MSG.HOST_NOT_CONNECTED).toBe(
            'Node host not connected!'
         );
         expect(constants.RES_MSG.INVALIDMNEMONICS).toBe('Invalid Mnemonics');
         expect(constants.RES_MSG.MANAGER).toBe('Invalid  Manager');
         expect(constants.RES_MSG.ADMIN).toBe(
            'Manager Will Be Updated By Admin Only'
         );
         expect(constants.RES_MSG.HIGHAMOUNT).toBe(
            'Amount is grater than maxSupply'
         );
      });
   });

   describe('Middleware Response Messages', () => {
      it('should have correct middleware response messages', () => {
         expect(constants.MIDDLEWARE_RESPONSE.JWTERROR).toBe(
            'Unauthorize Request'
         );
         expect(constants.MIDDLEWARE_RESPONSE.PERMISSION_DENIED).toBe(
            'Permission denied for this user.'
         );
         expect(constants.MIDDLEWARE_RESPONSE.ONLY_LOGIN_WORKS).toBe(
            'The feature is temporarily disabled.'
         );
      });
   });
});
