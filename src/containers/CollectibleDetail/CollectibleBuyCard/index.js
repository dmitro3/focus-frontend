import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { openCollectibleBuyDialog } from "../../../store/actions/dialogActions";
import { useMarketplaceContract, useNFT1155Contract } from "hooks/useContract";
import config from "../../../contract/config";
import "./style.scss";
import BuyDialog from "../../../components/Dialogs/BuyDialog";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import Web3 from "web3";
import Blockies from "react-blockies";
import { CardHeader } from "@material-ui/core";
import Axios from "axios";
import * as ethers from 'ethers';

const CollectibleBuyCard = (props) => {
  const {
    ownerImg,
    ownerName,
    rating,
    quantity,
    sale_price,
    openCollectibleBuyDialog,
    saleStatus,
    id,
    owner, 
    ifpsURL,
    changeLoading,
    contractAddress,
    setBuyResultDialog,
    setBuyResultStatus,
    buyer,
    signature,
    fullPrice
  } = props;

  const SIGNING_DOMAIN_NAME = "LazyNFT-Voucher"
  const SIGNING_DOMAIN_VERSION = "1"

  const [buyDialogShow, setBuyDialogShow] = useState(false);
  const [platformFee, setPlatformFee] = useState(50);
  const { account } = useWallet();

  const marketContract = useMarketplaceContract(
    config.abi.MarketplaceAbi,
    config.contract.Marketplace[process.env.REACT_APP_NETWORK_ID]
  );

  const nftContract = useNFT1155Contract(
    config.abi.NFT1155Abi,
    config.contract.NFT1155[process.env.REACT_APP_NETWORK_ID]
  );

  useEffect(() => {
    const getPlatformFee = () => {
      let fee = marketContract.methods.platformFee().call();
      if (fee.PromiseState == "fulfilled") {
        fee = fee.PromiseResult;
      } else {
        fee = 50;
      }
      setPlatformFee(fee);
    };
    getPlatformFee();
  }, []);

  const onBuyItem = async () => {
    setBuyDialogShow(false);
    changeLoading(true);
    let buyStatus = true;

    try {
      await nftContract.methods.redeem(buyer, 'Here we should pass the voucher', String(quantity), String(quantity), []).send({
        from: account
      })
    } catch (error) {
      console.log("Error uploading file: ", error);
      changeLoading(false);
      buyStatus = false;
      setBuyResultDialog(true);
      setBuyResultStatus(false);
    }
    if (buyStatus) {  
      setBuyResultStatus(true);
      setBuyResultDialog(true);
    }
    changeLoading(false);
  };

  async function createVoucher(tokenId, uri, minPrice = 0) {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "kovan");
    const minter = await provider.getSigner();
    let walletWithProvider = new ethers.Wallet(provider, {
      from: minter.getAddress()
    });

    console.log(walletWithProvider);

    const voucher = { tokenId, uri, minPrice }
    const domain = await _signingDomain()
    const types = {
      NFTVoucher: [
        {name: "tokenId", type: "uint256"},
        {name: "minPrice", type: "uint256"},
        {name: "uri", type: "string"},  
      ]
    }
    const signature = await minter._signTypedData(domain, types, voucher)
    return {
      ...voucher,
      signature,
    }
  }

  async function _signingDomain() {
    let _domain = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: nftContract.address,
      chainId: config.contract.NFT1155[process.env.REACT_APP_NETWORK_ID],
    }
    return _domain
  }

  return (
    <div>
      <div className="collectible-buy-card">
        <div className="buy-card-header">
          <h3 className="card-title">
            {quantity == 1 ? "Unique" : ""}Photo Asset
          </h3>
          <div className="rating-infos">
            <img className="rating-img" src="/img/type1.png" alt="" />
            <span className="rating-text">{sale_price}</span>
          </div>
        </div>
        {saleStatus && (
          <button className="buy-btn" onClick={() => setBuyDialogShow(true)}>
            Buy now
          </button>
        )}

        <div className="owner-info">
          {ownerImg && owner ? (
            <img className="owner-img" src={ownerImg} alt="" />
          ) : (
            <Blockies
              seed={owner ? owner : ""}
              size={12}
              scale={3}
              className="owner-img"
            />
          )}
          <div>
            <div className="owner-info-detail">
              <h3 className="owner-name">{ownerName}</h3>
              <span className="owner-type">Owner</span>
            </div>
            {/* {owner ? (
              <span className="owner-type">
                {owner.substr(0, 6) +
                  "...." +
                  owner.substr(owner.length - 4, owner.length - 1)}
              </span>
            ) : (
              <></>
            )} */}
          </div>
        </div>

        <div className="quantity-info">
          <span>
            {quantity} of {quantity} edition
          </span>
        </div>
        <hr className="card-divider" />

        <div className="card-actions">
          <div
            className="card-actions__item"
            onClick={() => window.open(ifpsURL)}
          >
            <img
              className="card-actions__item__imgipfs"
              src="/img/IPFS.png"
              alt=""
            />
            <span className="card-actions__item__text">
              View on Interplanetary File System(IPFS)
            </span>
          </div>

          <div
            className="card-actions__item"
            onClick={() =>
              window.open(`https://bscscan.com/address/${contractAddress}`)
            }
          >
            <img
              className="card-actions__item__img"
              src="/img/BscScan.png"
              alt=""
            />
            <span className="card-actions__item__text">View on BscScan</span>
          </div>
        </div>
      </div>

      <BuyDialog
        show={buyDialogShow}
        sale_price={sale_price}
        platformFee={platformFee}
        closeBuyDlg={() => setBuyDialogShow(false)}
        onBuyItem={() => onBuyItem()}
      />
    </div>
  );
};

const mapDispatchToProps = {
  openCollectibleBuyDialog,
};

export default connect(null, mapDispatchToProps)(CollectibleBuyCard);
// export default CollectibleBuyCard;
