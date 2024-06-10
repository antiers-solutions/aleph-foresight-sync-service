import { BN, BN_ONE } from '@polkadot/util';
import { ContractPromise } from '@polkadot/api-contract';
import { Abi721 } from '../contracts/nft721.abi';
import { Abi1155 } from '../contracts/marketplace_psp37.abi';
import { EVM721 } from '../contracts/evm721.abi';
import { EVM1155 } from '../contracts/evm1155.abi';
const Web3 = require('web3');
const { Logger } = require('../logger');
class ContractHelper {
   public MAX_CALL_WEIGHT;
   public PROOFSIZE;
   public web3;

   constructor() {
      this.MAX_CALL_WEIGHT = new BN(5000000000000).isub(BN_ONE);
      this.PROOFSIZE = new BN(1000000);
      this.web3 = new Web3(process.env.SOCKET_HOST);
      this.web3.eth.net
         .isListening()
         .then(() => Logger.info('Web3 connection established'))
         .catch((err: any) =>
            Logger.error('Unable to connect to the Web3 provider: ' + err)
         );
   }

   async intialiseContract(
      address: string,
      contract_type: string,
      api: any,
      chainType: any
   ) {
      let Contract: any;
      if (chainType == 'Native') {
         Contract = new ContractPromise(
            api,
            contract_type == 'ERC-721' ? Abi721 : Abi1155,
            address
         );
      } else {
         Contract = new this.web3.eth.Contract(
            contract_type == 'ERC-721' ? EVM721 : EVM1155,
            address
         );
      }
      return Contract;
   }

   // getContractHolder = (contractAddress: string) => {
   //    return new Promise((resolve, reject) => {
   //       try {
   //          const query = {
   //             contractAddress: contractAddress,
   //          };
   //          // Contract.find(
   //          //    query,
   //          //    { allow_filtering: true, raw: true },
   //          //    function (err: any, data: any) {
   //          //       if (err) {
   //          //          reject([]);
   //          //       }
   //          //       resolve(data ? data[0] : {});
   //          //    }
   //          // );
   //       } catch (error) {
   //          reject([]);
   //       }
   //    });
   // };

   async getUri(tokenId: number, account: string, contract: any, api: any) {
      try {
         const result: any = {};
         const storageDepositLimit: any = null;
         const tokenUri = await contract.query.getTokenUri(
            account,
            {
               gasLimit: api?.registry.createType('WeightV2', {
                  refTime: this.MAX_CALL_WEIGHT,
                  proofSize: this.PROOFSIZE,
               }),
               storageDepositLimit,
            },
            {
               U32: tokenId,
            }
         );
         result['Id'] = tokenId;
         result['ipfsLink'] = tokenUri?.output?.toHuman()?.Ok;
         return result;
      } catch (error) {
         Logger.error(error.toString());
      }
   }

   async balanceOf(
      contract: any,
      holder: any,
      address: any,
      tokenId: any,
      api: any,
      chainType: any
   ) {
      try {
         const storageDepositLimit: any = null;
         let availableAmount: any;
         if (chainType == 'Native') {
            const { output } = await contract.query['psp37::balanceOf'](
               holder,
               {
                  gasLimit: api?.registry.createType('WeightV2', {
                     refTime: this.MAX_CALL_WEIGHT,
                     proofSize: this.PROOFSIZE,
                  }),
                  storageDepositLimit,
               },
               address,
               {
                  U32: tokenId,
               }
            );
            const Amount = output.toHuman().Ok.replaceAll(',', '');
            availableAmount = Amount;
         } else {
            availableAmount = await contract.methods
               .balanceOf(address, tokenId)
               .call();
         }
         return availableAmount;
      } catch (error) {
         Logger.error(error.toString());
      }
   }

   async ownerOf(contract: any, tokenId: any, api: any, onChain: any) {
      try {
         let isOwner: any;
         if (onChain == 'Native') {
            const { output } = await contract.query['psp34::ownerOf'](
               null,
               {
                  gasLimit: api?.registry.createType('WeightV2', {
                     refTime: this.MAX_CALL_WEIGHT,
                     proofSize: this.PROOFSIZE,
                  }),
                  storageDepositLimit: null,
               },
               {
                  U32: tokenId,
               }
            );
            isOwner = output.toHuman()?.Ok;
         } else {
            isOwner = await contract.methods.ownerOf(tokenId).call();
         }
         return isOwner;
      } catch (err) {
         Logger.error(err.toString());
      }
   }

   async saveContract(contractData: any, api: any) {
      const [deployer, contract] = contractData;
      try {
         const Data = {
            contractAddress: `${contract.toHuman()}`,
            holder: `${deployer.toHuman()}`,
            contract_type: 'ERC',
            onChain: 'Native',
         };
         await this.intialiseContract(
            `${contract.toHuman()}`,
            'ERC-721',
            api,
            'Native'
         )
            .then(async (res) => {
               const { output } = await res.query.mint(
                  `${deployer.toHuman()}`,
                  {
                     gasLimit: api?.registry.createType('WeightV2', {
                        refTime: this.MAX_CALL_WEIGHT,
                        proofSize: this.PROOFSIZE,
                     }),
                     storageDepositLimit: null,
                  },
                  `${deployer.toHuman()}`,
                  `check`
               );
               // if (output && output.toHuman().Ok) {
               //    Data.contract_type = 'ERC-721';
               //    await this.saveToDb(Data);
               // } else {
               //    throw 'Invalid ABI';
               // }
            })
            .catch(() => {
               this.intialiseContract(
                  `${contract.toHuman()}`,
                  'ERC-1155',
                  api,
                  'Native'
               )
                  .then(async (res) => {
                     if (res) {
                        const { output } = await res.query.createNft(
                           `${deployer.toHuman()}`,
                           {
                              gasLimit: api?.registry.createType('WeightV2', {
                                 refTime: this.MAX_CALL_WEIGHT,
                                 proofSize: this.PROOFSIZE,
                              }),
                              storageDepositLimit: null,
                           },
                           `${deployer.toHuman()}`,
                           1,
                           `check`
                        );
                        // if (output && output.toHuman().Ok) {
                        //    Data.contract_type = 'ERC-1155';
                        //    await this.saveToDb(Data);
                        // }
                     }
                  })
                  .catch((err) => {
                     throw err;
                  });
            });
      } catch (error) {
         Logger.error(error.toString());
      }
   }

   //async saveToDb(Data: any) {}
}

export default new ContractHelper();
