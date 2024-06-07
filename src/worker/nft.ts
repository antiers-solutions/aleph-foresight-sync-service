const { models } = require('../connection');
const axios = require('axios');
const Transaction = models.Transaction;
const Events = models.Events;
const Token = models.Token;
import TransactionHelper from '../helpers/transaction.helper';
import ContractHelper from '../helpers/contract.helper';


Transaction.syncDB((err: Error) => {
   if (err) throw err;
});
Events.syncDB((err: Error) => {
   if (err) throw err;
});

class NftToken {
   public contract: any;

   async isToken(tokenId: number, contractAddress: string) {
      return new Promise((resolve, reject) => {
         try {
            Token.find(
               {
                  token_id: tokenId,
                  contract_add: contractAddress,
               },
               { allow_filtering: true, raw: true },
               function (err: any, data: any) {
                  if (err) {
                     reject({});
                  }
                  resolve(data ? data[0] : []);
               }
            );
         } catch (error) {
            reject({});
         }
      });
   }

   async fetchDataFromIPFS(link: string) {
      try {
         const response = await axios.get(link);
         const jsonData = await response.data;
         return jsonData;
      } catch (error) {
         console.error('Invalid Ipfs link', error.toString());
         return {};
      }
   }

   async Nft(api?: any, tokenId?: any, contractAddress?: any) {
      console.log('NFT');
      try {
         const totalNft: any = await TransactionHelper.getNftTransaction(
            contractAddress,
            tokenId
         );
         for (let idx = 0; idx < totalNft?.length; idx++) {
            const data = totalNft[idx];
            const tokenId = data.tokenId;
            if (tokenId == null) {
               continue;
            }
            let amount: any = 1;
            if (data && data?.contractAddress) {
               const account: any = await ContractHelper.getContractHolder(
                  data?.contractAddress
               );
               if (account) {
                  await ContractHelper.intialiseContract(
                     data?.contractAddress,
                     account?.contract_type,
                     api,
                     account?.onChain
                  )
                     .then(async (contract: any) => {
                        let tokenData = {
                           Id: '',
                           ipfsLink: '',
                        };
                        tokenData.Id = tokenId;
                        if (account?.onChain == 'Native') {
                           tokenData = await ContractHelper.getUri(
                              data?.tokenId,
                              account?.holder,
                              contract,
                              api
                           );
                        } else {
                           //evm chain
                           if (account?.contract_type == 'ERC-721') {
                              const getIpfs = await contract.methods
                                 .tokenURI(data?.tokenId)
                                 .call();
                              tokenData.ipfsLink = getIpfs;
                           } else {
                              const getIpfs = await contract.methods
                                 .uri(data?.tokenId)
                                 .call();
                              tokenData.ipfsLink = getIpfs;
                           }
                        }
                        if (
                           account?.contract_type == 'ERC-1155' &&
                           data.to != null
                        ) {
                           await ContractHelper.balanceOf(
                              contract,
                              account?.holder,
                              data?.to,
                              data?.tokenId,
                              api,
                              account?.onChain
                           ).then((Amount: any) => {
                              amount = Amount;
                           });
                        } else if (
                           account?.contract_type == 'ERC-721' &&
                           data.to != null
                        ) {
                           await ContractHelper.ownerOf(
                              contract,
                              data?.tokenId,
                              api,
                              account?.onChain
                           ).then((isOwner: any) => {
                              amount =
                                 isOwner?.toLowerCase() ==
                                    data.to?.toLowerCase()
                                    ? 1
                                    : 0;
                           });
                        } else {
                           return;
                        }
                        await this.fetchDataFromIPFS(tokenData?.ipfsLink).then(
                           async (jsondata: any) => {
                              await this.isToken(
                                 tokenId,
                                 data?.contractAddress
                              ).then((istoken: any) => {
                                 if (data.to && data.timestamp) {
                                    const token = new Token({
                                       token_id: tokenId,
                                       image: jsondata?.url,
                                       location: jsondata?.location,
                                       creator: istoken
                                          ? istoken?.creator
                                          : data.to,
                                       owner: data.to,
                                       price: null,
                                       contract_add: data.contractAddress,
                                       token_standard: account?.contract_type,
                                       name: jsondata?.name || '',
                                       sectionmethod: data?.sectionmethod,
                                       amount: amount ? Number(amount) : amount,
                                       description: jsondata?.description || '',
                                       mint_time: `${data.timestamp}`,
                                    });
                                    token.save((err: any) => {
                                       if (err) {
                                          console.log(err.toString());
                                       }
                                    });
                                 }
                              });
                           }
                        );
                     })
                     .catch((err) => {
                        console.log(err.toString());
                     });
               }
            }
         }
      } catch (error) {
         console.log(error.toString());
         return;
      }
   }
}

export default new NftToken();
