import { duration } from "@material-ui/core";
import config from "./config";
import Axios from "axios"

export const lazyMintNFT = async (
  minter,
  tokenURI,
  imageURL,
  amount,
  id,
  value,
  signature,
  account,
  name,
  desc
) => {
  Axios.post(`${process.env.REACT_APP_API}/lazy-mint`, {
    minter, 
    id,
    value,
    signature,
    tokenURI,
    imageURL,
    amount,
    account,
    startingTime: new Date().now,
    name,
    desc
  })
}

export const listSaleItem = async (
  account,
  tokenId,
  amount,
  price,
  collection,
  imageURL
) => {
  Axios.post(`${process.env.REACT_APP_API}/list-item`, {
    account,
    id: tokenId,
    amount,
    value: price,
    collection,
    imageURL
  })
};

export const createAuction = async (
  auctionContract,
  nftContract,
  account,
  tokenId,
  amount,
  initialPrice,
  auctionDuration,
  royalty
) => {
  if (auctionContract) {
    const allowed = await nftContract.methods
      .isApprovedForAll(
        account,
        config.contract.Auction[process.env.REACT_APP_NETWORK_ID]
      )
      .call();

    if (!allowed) {
      await nftContract.methods
        .setApprovalForAll(
          config.contract.Auction[process.env.REACT_APP_NETWORK_ID],
          true
        )
        .send({ from: account });
    }
    return await auctionContract.methods.createAuction(
        config.contract.NFT1155[process.env.REACT_APP_NETWORK_ID],
        tokenId,
        amount,
        initialPrice,
        0,
        auctionDuration,
        0,
        0
        // royalty || 0
      )
      .send({ from: account });
  }
};
