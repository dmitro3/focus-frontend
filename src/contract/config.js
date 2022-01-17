import NFT1155Abi from "./abi/nft1155.json";
import MarketplaceAbi from "./abi/marketplace.json";
import AuctionAbi from "./abi/auction.json";
require("dotenv").config();

const config = {
  abi: {
    NFT1155Abi,
    MarketplaceAbi,
    AuctionAbi,
  },
  contract: {
    NFT1155: {
      42: "0xC8D0dB3216587f641266FAa303e097Ac57388924", // chainId: Contarct address
    },
    Marketplace: {
      42: "0xC8D0dB3216587f641266FAa303e097Ac57388924",
    },  
    Auction: {
      42: "0xC8D0dB3216587f641266FAa303e097Ac57388924",
    }
  },
};

export default config;
 