import React, { useEffect, useState } from "react";
import { connect, Provider } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import "./styles.scss";
import CollectibleBuyCard from "./CollectibleBuyCard";
import CollectibleAuctionCard from "./CollectibleAuctionCard";
import CollectibleCreatorInfo from "./CollectibleCreatorInfo";
import CollectibleHistory from "./CollectibleHistory"; 
import { idText } from "typescript";
import API from "../../utils/api.js";
import Axios from "axios";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import Blockies from "react-blockies";
import Loading from "components/Common/Loading";
import BuyResultDialog from "components/Dialogs/BuyResultDialog";
import BidResultDialog from "components/Dialogs/BidResultDialog";
import twitterImg from "assets/img/twitter.png"
import InstagramImg from "assets/img/instagram.png"
import facebookImg from "assets/img/facebook.png"
import likeImg from "assets/img/heart.png"
import eyeImg from "assets/img/eye.png"
import shareImg from "assets/img/share.png"
import { FacebookShareButton, TwitterShareButton } from "react-share";

import Web3 from "web3";
import CollectibleNotSale from "./CollectibleNotSale";
const contractAddress = '0xC8D0dB3216587f641266FAa303e097Ac57388924'
const contractABI = require("../../contract/abi/nft1155.json");

var web3 = new Web3(Web3.givenProvider);

const line = ()=>{
  console.log('=====================')
}

const CollectibleDetail = (props) => {
  const { user = {}, collectible_item } = props;
  const [collectible, setCollectible] = useState({});
  const [collectibleItems, setCollectibleItems] = useState("");
  const { id, address } = props.match.params;
  const { account } = useWallet();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saleStatus, setSaleStatus] = useState(true);
  const [count, addCount] = useState(0)

  const [buyResultDialog, setBuyResultDialog] = useState(false);
  const [buyResultStatus, setBuyResultStatus] = useState(true);

  const [bidResultDialog, setBidResultDialog] = useState(false);
  const [bidResultStatus, setBidResultStatus] = useState(true);
  const changeLoading = (status) => {
    setLoading(status);
  };

  const fetchCollectible = async () => {
    let user;

    if (count == 0){
      addCount(1)
      setLoading(true);
      await Axios.get(
        `${process.env.REACT_APP_API}/account?address=${String(
          address
        )}`
      ).then((res) => {
        user = res.data.user;
        console.log(address)
      });
  
    await Axios.get(`${process.env.REACT_APP_API}/collectible?tokenID=${id}`)
      .then((response) => {
        console.log(response)
        setCollectibleItems({ data: response.data.item });
        Axios.get(`${response.data.item.tokenURI}`)
          .then((res) => {
            Axios.get(
              `${process.env.REACT_APP_API}/sale-item?address=${
                address}`
            )
              .then((resp) => {
                console.log('sale')
                let data = resp.data.items.filter(
                  (t) => t.tokenID === response.data.item.tokenID
                );
                setUserData(user);
                setLoading(false);
                if (data.length == 0) {
                  setSaleStatus(false);
                }

                Axios.get(
                  `${process.env.REACT_APP_API}/account?address=${String(
                    address)}`
                ).then((resps) => {
                  setCollectible({
                    type: "saleItem",
                    id: id,
                    // title: response.data.item.name,
                    img: response.data.item.imageURL,
                    ifpsURL: response.data.item.tokenURI,
                    contractAddress: response.data.item.contractAddress,
                    creatorAddress: response.data.item.minter,
                    ownerAddress: data[0].owner,
                    ownerAvatar: data[0].ownerAvatar,
                    minterAvatar: data[0].minterAvatar,
                    description: res.data.description,
                    price: Number(res.data.price).toFixed(5),
                    fullPrice: res.data.price,
                    quantity: res.data.amount,
                    rating: res.data.price,
                    creatorName: res.data.name,
                    ownerName: resps.data.user.name,
                    viewed: data[0].viewed,
                    liked: data[0].liked,
                    shared: data[0].shared,
                    signature: response.data.item.signature
                  });
                  Axios.post( `${process.env.REACT_APP_API}/viewed`, {
                    nft_id: id
                  });
                })
                .catch((err) => {
              
                  Axios.get(
                    `${process.env.REACT_APP_API}/auction?address=${String(
                      address
                    )}`
                  )
                    .then((resp) => {
                      console.log('auction')
                      let data = resp.data.items.filter(
                        (t) => t.tokenID === response.data.item.tokenID
                      );
                      setUserData(user);
                      setLoading(false);
                      console.log(data)
                      if (data.length == 0) {
                        setSaleStatus(false);
                      }
      
                      Axios.get(
                        `${process.env.REACT_APP_API}/account?address=${String(
                          data[0].owner
                        )}`
                      ).then((resps) => {
      
                        setCollectible({
                          type: "auction",
                          id: id,
                          // title: response.data.item.name,
                          img: response.data.item.imageURL,
                          ifpsURL: response.data.item.tokenURI,
                          contractAddress: response.data.item.contractAddress,
                          creatorAddress: response.data.item.minter,
                          ownerAddress: data[0].owner,
                          ownerAvatar: data[0].ownerAvatar,
                          minterAvatar: data[0].minterAvatar,
                          description: res.data.description,
                          creatorName: res.data.name,
                          ownerName: resps.data.user.name,
                          
                          quantity: data[0].quantity,
                          highestBid: data[0].highestBid,
                          initialPrice: data[0].initialPrice,
                          startTime: data[0].startTime,
                          endTime: data[0].endTime,
                          minBidDifference: data[0].minBidDifference,
                        });
                        Axios.post( `${process.env.REACT_APP_API}/viewed`, {
                          nft_id: id
                        });
                      })
                      
                    })

                    .catch(err =>{
                      console.log('xd')
                      Axios.get(
                        `${process.env.REACT_APP_API}/holding?address=${String(
                          address
                        )}&tokenID=${id}`)
                        .then((respo)=>{
                          let data = respo.data.items.filter(
                            (t) => t.tokenID === response.data.item.tokenID
                          );
                          setUserData(user);
                          setLoading(false);
                          console.log(data[0])
                          setCollectible({
                            type: "noSale",
                            id: id,
                            img: data[0].imageURL,
                            ifpsURL: data[0].tokenURI,
                            contractAddress: data[0].contractAddress,
                            ownerAddress: data[0].minter,
                            ownerAvatar: data[0].ownerAvatar,
                            minterAvatar: data[0].ownerAvatar,
                            quantity: data[0].supply,
                            rating: '',
                            ownerName: data[0].ownerName,
                            viewed: data[0].viewed,
                            liked: data[0].liked ,
                            shared: data[0].shared,
                            description: data[0].description,
                            creatorName: data[0].ownerName,
                            title: data[0].name,
                          })
                          Axios.post( `${process.env.REACT_APP_API}/viewed`, {
                            nft_id: id
                          });
                        })
                    })
                })
              
              })
              
              
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  } else {
    console.log('error')
  }

  };

  useEffect(() => {
    fetchCollectible();
    addCount(0)
  }, []);

  let share = async () => {
    await Axios.post(`${process.env.REACT_APP_API}/shared?nft_id=${collectible.id}`).then((res) => {
      console.log('Shared!');
      
      if (res.data == "Success") {
        document.getElementById("sharesCounter").innerText = Number(document.getElementById("sharesCounter").innerText) + 1
      }

      console.log(res);
    }).catch((err) => {
      console.log('Error Sharing');

      console.log(err);
    })
  }

  let likeIt = async () => {

    let contract = await new web3.eth.Contract(contractABI, contractAddress);

    if (account){
    let msgRaw = "We ask you to sign this message to prove ownership of this account."
    let msg = await contract.methods.getMessageHash(msgRaw).call()
      console.log(msg)
    let sig = await window.ethereum.request({
      method: "personal_sign",
      params: [account, msg,'']
    });


    console.log('Starting')

    await Axios.post(`${process.env.REACT_APP_API}/like`, {
      address: account,
      nft_id: collectible.id,
      msg:msg
    }, {
      headers: {
        signature: sig
    }
    }).then((result) => {
      console.log(result.data);
        if (result.data == "The like has been deleted") {
          document.getElementById("likesCounter").innerText = Number(document.getElementById("likesCounter").innerText) - 1
        } else {
          document.getElementById("likesCounter").innerText = Number(document.getElementById("likesCounter").innerText) + 1
        }
      }).catch((err) => {
        console.log('3');
        console.log(err)
      })       
    } else {
      console.log('Connect your wallet first')
    }
  }

  console.log(collectible.type);
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="collectible-detail">
          <div className="collectible-infos container">
            <div className="collectible-img-wrapper">
              <div 
              onClick={() => window.open(collectible.img)}>
                <img
                  className="collectible-img"
                  src={collectible.img}
                  alt={""}
                  onContextMenu={(ev) => {
                    ev.preventDefault();
                  }}
                />
              </div>
            </div>

            <div className="social-bar">
              <div>
                <FacebookShareButton
                  url={"focus.market"}
                  quote={"FocusIsTheBest"}
                  hashtag={"#focus"}
                  description={"focus"}
                  className="Demo__some-network__share-button" 
                  onClick={share}
                >
                  <img 
                    style={{width: "40px", height: '40px'}}
                    className="social-icon"
                    src={facebookImg} 
                  />
                </FacebookShareButton>
                <TwitterShareButton
                  url={"focus.market"}
                  hashtle={"New Marketplace - Focus"}
                  urltags={["#focus", "#nft"]}
                  onClick={share}
                >
                  <img
                    style={{width: "40px", height: '40px'}}
                    className="social-icon"
                    src={twitterImg} 
                  />
                  
                </TwitterShareButton>
                {/* <img className="social-icon" src={InstagramImg} /> */}
              </div>

              <div>
                <a onClick={fetchCollectible}>
                <img className="social-icon" src={shareImg} />
                <span id="sharesCounter" style={{fontSize: "39px"}}> {collectible.shared} </span>
                </a>

                <img className="social-icon" src={eyeImg} />
                <span style={{fontSize: "39px"}}> {collectible.viewed + 1}   </span>

                <a onClick={likeIt}>
                  <img className="social-icon" style={{cursor: "pointer"}} src={likeImg} />
                  <span id="likesCounter" style={{fontSize: "39px"}}> {collectible.liked}</span>
                </a>
              </div>
            </div>

            <div className="collectible-info-detail">
              <CollectibleCreatorInfo
                title={collectible.title}
                creatorImg={collectible.minterAvatar}
                creatorName={collectible.ownerName}
                description={collectible.description}
                creatorAddress={collectible.creatorAddress}
              />

              {collectible.type === "auction" ? (
                <CollectibleAuctionCard
                  description={collectible.description}
                  ownerImg={collectible.ownerAvatar}
                  ownerName={collectible.ownerName}
                  id={id}
                  ifpsURL={collectible.ifpsURL}
                  owner={collectible.ownerAddress}
                  contractAddress={collectible.contractAddress}
                  changeLoading={changeLoading}
                  saleStatus={saleStatus}
                  setBidResultDialog={setBidResultDialog}
                  setBidResultStatus={setBidResultStatus}

                  quantity={collectible.quantity} 
                  highestBid={collectible.highestBid}
                  initialPrice={collectible.initialPrice}
                  startTime={collectible.startTime}
                  endTime={collectible.endTime}
                  minBidDifference={collectible.minBidDifference}
                />
              ) : collectible.type === "saleItem" ? (
                <CollectibleBuyCard
                  description={collectible.description}
                  ownerImg={collectible.ownerAvatar}
                  ownerName={collectible.ownerName}
                  sale_price={collectible.price}
                  rating={collectible.rating}
                  quantity={collectible.quantity}
                  id={id}
                  ifpsURL={collectible.ifpsURL}
                  owner={collectible.ownerAddress}
                  contractAddress={collectible.contractAddress}
                  rating={Number(collectible.rating)}
                  changeLoading={changeLoading}
                  saleStatus={saleStatus}
                  setBuyResultDialog={setBuyResultDialog}
                  setBuyResultStatus={setBuyResultStatus}
                  buyer={account}
                  signature={collectible.signature}
                  fullPrice={collectible.fullPrice}
                />
              ) : (
                <CollectibleNotSale 
                description={collectible.description}
                ownerImg={collectible.ownerAvatar}
                ownerName={collectible.ownerName}
                quantity={collectible.quantity}
                ifpsURL={collectible.ifpsURL}
                owner={collectible.ownerAddress}
                contractAddress={collectible.contractAddress}
                rating={Number(collectible.rating)}
                />
              )}
            </div>
          </div>
          <div className="collectible-detail-footer">
            {collectible.minterAvatar ? (
              <img
                className="user-picture"
                src={collectible.minterAvatar}
                alt=""
              />
            ) : (
              <Blockies
                seed={collectible.ownerAddress ? collectible.ownerAddress : ""}
                size={12}
                scale={10}
                className="user-picture"
              />
            )}
            <p className="user-name">{collectible.ownerName}</p>
            <Link
              className="profile-link"
              to={`/account/${collectible.ownerAddress}`}
            >
              Visit profile
            </Link>
          </div>
        </div>
      )}
      <BuyResultDialog
        show={buyResultDialog}
        closeBuyDlg={() => setBuyResultDialog(false)}
        buyResultStatus={buyResultStatus}
      />
      <BidResultDialog
        show={bidResultDialog}
        closeBidDlg={() => setBidResultDialog(false)}
        bidResultStatus={bidResultStatus}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  collectible_item: state.collectible,
});

export default connect(mapStateToProps)(withRouter(CollectibleDetail));
// export default CollectibleDetail;
