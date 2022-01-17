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

const CollectibleNotSale = (props) => {
  const {
    ownerImg,
    ownerName,
    quantity,
    rating,
    owner,
    ifpsURL,
    contractAddress,
    description
  } = props;

  return (
    <div>
      <div className="collectible-buy-card">
        <div className="buy-card-header">
          <h3 className="card-title">
            {quantity == 1 ? "Unique" : ""}Photo Asset
          </h3>
          <div className="rating-infos">
            <img className="rating-img" src="/img/type1.png" alt="" />
            <span className="rating-text">{rating}</span>
          </div>
        </div>

        <div className="owner-info">
          {ownerImg ? (
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


    </div>
  );
};

export default CollectibleNotSale;
