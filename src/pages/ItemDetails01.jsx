import React, { useState, useEffect } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Link, useLocation } from "react-router-dom";
import Countdown from "react-countdown";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import liveAuctionData from "../assets/fake-data/data-live-auction";
import LiveAuction from "../components/layouts/LiveAuction";
import img1 from "../assets/images/avatar/avt-3.jpg";
import img2 from "../assets/images/avatar/avt-11.jpg";
import img3 from "../assets/images/avatar/avt-1.jpg";
import img4 from "../assets/images/avatar/avt-5.jpg";
import img5 from "../assets/images/avatar/avt-7.jpg";
import img6 from "../assets/images/avatar/avt-8.jpg";
import { ethers } from "ethers";
import auctionData from "../artifacts/contracts/Auction.sol/Auction.json";
import nftData from "../artifacts/contracts/NFTMarket.sol/NFT.json";

const ItemDetails01 = () => {
  const location = useLocation();
  const {
    auctionAddress,
    name,
    image,
    description,
    artist,
    artistImg,
    nftAddress,
  } = location.state;

  const [auctionState, setAuctionState] = useState(0);
  const [currentRefund, setCurrentRefund] = useState(0);
  const [maxBidder, setMaxBidder] = useState();
  const [maxBid, setMaxBid] = useState(0);
  const [signerAddress, setSignerAddress] = useState();
  const [directBuyPrice, setDirectBuyPrice] = useState();
  const [biddingAmount, setBiddingAmount] = useState();
  const [endDate, setEndDate] = useState();
  const [ withdrawnNFT, setWithdranNFT ] = useState(false)

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const auctionContract = new ethers.Contract(
    auctionAddress,
    auctionData.abi,
    signer
  );

  async function placeBid(bid, _auctionContract) {
    const tx = await auctionContract.placeBid({
      value: ethers.utils.parseEther(bid),
    });
    const receipt = await tx.wait();
    return receipt;
  }

  async function withdrawNFT() {
    const tx = await auctionContract.withdrawNFT();
    const receipt = await tx.wait();
    console.log(receipt);
    approveMarket();
  }

  async function withdrawRefunds() {
    const tx = await auctionContract.getRefunds();
    const receipt = await tx.wait();
    console.log(receipt);
  }

  async function approveMarket() {
    const nftContract = await new ethers.Contract(
      nftAddress,
      nftData.abi,
      signer
    );
    const tx = await nftContract.setApprovalForAll(
      process.env.REACT_APP_MARKET_ADDRESS,
      true
    );
    const receipt = await tx.wait();
    console.log(receipt);
  }

  function bidInputHandler(e) {
    setBiddingAmount(e.target.value);
  }

  useEffect(() => {
    async function fillChainValues() {
      const _auctionState = await auctionContract.getAuctionState();
      setAuctionState(_auctionState);
      const _maxBidder = await auctionContract.maxBidder();
      setMaxBidder(_maxBidder);
      const _maxBid = await auctionContract.maxBid();
      setMaxBid(ethers.utils.formatEther(_maxBid));
      const _directBuyPrice = await auctionContract.directBuyPrice();
      setDirectBuyPrice(ethers.utils.formatEther(_directBuyPrice));
      const _signerAddress = await signer.getAddress();
      setSignerAddress(_signerAddress);
      const _currentRefund = await auctionContract.refunds(_signerAddress);
      setCurrentRefund(_currentRefund);
      const _endTime = (await auctionContract.endTime()).toNumber();
      const date = new Date(_endTime * 1000);
      setEndDate(date);
      const _withdrawnNFT = await auctionContract.withdrawnNFT()
      setWithdranNFT(_withdrawnNFT)
    }
    fillChainValues();
  }, []);

  const closedAuctionComponent = (
    <>
      {signerAddress && signerAddress === maxBidder && !withdrawnNFT &&(
        <button
          onClick={() => {
            withdrawNFT();
          }}
        >
          Withdraw NFT
        </button>
      )}
      {currentRefund
        ? currentRefund > 0 && (
            <button onClick={withdrawRefunds}>Get Refunds</button>
          )
        : null}
    </>
  );

  const openAuctionComponent = (
    <>
      <h2>Highest Bid: {maxBid ? maxBid : 0} ETH</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginBottom: "5px",
        }}
      >
        <input
          style={{ width: "33%", minWidth: "200px" }}
          type="number"
          onChange={bidInputHandler}
        />
        <button
          style={{ marginTop: "12px", marginBottom: "22px" }}
          onClick={() => {
            placeBid(biddingAmount, auctionContract);
          }}
        >
          Place Bid
        </button>
      </div>
      <div style={{ alignItems: "center", marginBottom: "20px" }}>
        <h2>Direct Buy Price : {directBuyPrice ?? 0} ETH</h2>
        <button
          style={{ marginBottom: "30px" }}
          onClick={() => {
            directBuyPrice &&
              placeBid(directBuyPrice.toString(), auctionContract);
          }}
        >
          Direct Buy
        </button>
      </div>
    </>
  );

  const [dataHistory] = useState([
    {
      img: img1,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img2,
      name: "Mason Woodward",
      time: "at 06/10/2021, 3:20 AM",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img3,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img4,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img5,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
    {
      img: img6,
      name: "Mason Woodward",
      time: "8 hours ago",
      price: "4.89 ETH",
      priceChange: "$12.246",
    },
  ]);
  return (
    <div className="item-details">
      <Header />
      <section className="flat-title-page inner">
        <div className="overlay"></div>
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="page-title-heading mg-bt-12">
                <h1 className="heading text-center">Item Details 1</h1>
              </div>
              <div className="breadcrumbs style2">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="#">Explore</Link>
                  </li>
                  <li>Item Details 1</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="tf-section tf-item-details">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-xl-6 col-md-12">
              <div className="content-left">
                <div className="media">
                  <img src={image} alt="Axies" />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-12">
              <div className="content-right">
                <div className="sc-item-details">
                  <h2 className="style2">{name}</h2>
                  <div className="meta-item">
                    <div className="left">
                      <span className="viewed eye">225</span>
                      <span
                        to="/login"
                        className="liked heart wishlist-button mg-l-8"
                      >
                        <span className="number-like">100</span>
                      </span>
                    </div>
                    <div className="right">
                      <Link to="#" className="share"></Link>
                      <Link to="#" className="option"></Link>
                    </div>
                  </div>
                  <div className="client-infor sc-card-product">
                    <div className="meta-info">
                      <div className="author">
                        <div className="avatar">
                          <img src={img6} alt="Axies" />
                        </div>
                        <div className="info">
                          <span>Owned By</span>
                          <h6>
                            {" "}
                            <Link to="/author-02">Ralph Garraway</Link>{" "}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="meta-info">
                      <div className="author">
                        <div className="avatar">
                          <img src={artistImg} alt="Axies" />
                        </div>
                        <div className="info">
                          <span>Created By</span>
                          <h6>
                            {" "}
                            <Link to="/author-02">{artist}</Link>{" "}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p>{description}</p>
                  <div className="meta-item-details style2">
                    <div className="item meta-price">
                      <span className="heading">Current Bid</span>
                      <div className="price">
                        <div className="price-box">
                          <h5>{maxBid} ETH</h5>
                        </div>
                      </div>
                    </div>
                    <div className="item count-down">
                      <span className="heading style-2">Countdown</span>
                      <Countdown date={endDate ?? new Date()}>
                        <span>Auction is over!</span>
                      </Countdown>
                    </div>
                  </div>
                  {auctionState === undefined ? (
                    <h1>Loading</h1>
                  ) : auctionState === 0 ? (
                    openAuctionComponent
                  ) : (
                    closedAuctionComponent
                  )}
                  <div className="flat-tabs themesflat-tabs">
                    <Tabs>
                      <TabList>
                        <Tab>Bid History</Tab>
                        <Tab>Info</Tab>
                        <Tab>Provenance</Tab>
                      </TabList>

                      <TabPanel>
                        <ul className="bid-history-list">
                          {dataHistory.map((item, index) => (
                            <li key={index} item={item}>
                              <div className="content">
                                <div className="client">
                                  <div className="sc-author-box style-2">
                                    <div className="author-avatar">
                                      <Link to="#">
                                        <img
                                          src={item.img}
                                          alt="Axies"
                                          className="avatar"
                                        />
                                      </Link>
                                      <div className="badge"></div>
                                    </div>
                                    <div className="author-infor">
                                      <div className="name">
                                        <h6>
                                          <Link to="/author-02">
                                            {item.name}{" "}
                                          </Link>
                                        </h6>{" "}
                                        <span> place a bid</span>
                                      </div>
                                      <span className="time">{item.time}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="price">
                                  <h5>{item.price}</h5>
                                  <span>= {item.priceChange}</span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </TabPanel>
                      <TabPanel>
                        <ul className="bid-history-list">
                          <li>
                            <div className="content">
                              <div className="client">
                                <div className="sc-author-box style-2">
                                  <div className="author-avatar">
                                    <Link to="#">
                                      <img
                                        src={img1}
                                        alt="Axies"
                                        className="avatar"
                                      />
                                    </Link>
                                    <div className="badge"></div>
                                  </div>
                                  <div className="author-infor">
                                    <div className="name">
                                      <h6>
                                        {" "}
                                        <Link to="/author-02">
                                          Mason Woodward{" "}
                                        </Link>
                                      </h6>{" "}
                                      <span> place a bid</span>
                                    </div>
                                    <span className="time">8 hours ago</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </TabPanel>
                      <TabPanel>
                        <div className="provenance">
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and
                            scrambled it to make a type specimen book. It has
                            survived not only five centuries, but also the leap
                            into electronic typesetting, remaining essentially
                            unchanged. It was popularised in the 1960s with the
                            release of Letraset sheets containing Lorem Ipsum
                            passages, and more recently with desktop publishing
                            software like Aldus PageMaker including versions of
                            Lorem Ipsum.
                          </p>
                        </div>
                      </TabPanel>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LiveAuction data={liveAuctionData} />
      <Footer />
    </div>
  );
};

export default ItemDetails01;
