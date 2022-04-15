import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { ethers } from "ethers";
import marketData from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import nftData from "../artifacts/contracts/NFTMarket.sol/NFT.json";

const CreateItem = () => {
  const [tokenUri, setTokenUri] = useState();
  const [artist, setArtist] = useState();
  const [bips, setBips] = useState();
  const [days, setDays] = useState();
  const [startPrice, setStartPrice] = useState();
  const [minIncrement, setMinIncrement] = useState();
  const [directBuyPrice, setDirectBuyPrice] = useState();

  const [tokenId, setTokenId] = useState(-1);
  const [signerAddress, setSignerAddress] = useState("");
  const [myCollections, setMyCollections] = useState([]);
  const [chosenCollection, setChosenCollection] = useState();

  function uriInputHandler(e) {
    setTokenUri(e.target.value);
  }

  function artistInputHandler(e) {
    setArtist(e.target.value);
  }

  function bipsInputHandler(e) {
    setBips(e.target.value);
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const marketContract = new ethers.Contract(
    process.env.REACT_APP_MARKET_ADDRESS,
    marketData.abi,
    signer
  );
  const nftContract = new ethers.Contract(
    process.env.REACT_APP_NFT_ADDRESS,
    nftData.abi,
    signer
  );
  async function mintNft(tokenUri, artist, bips) {
    if (chosenCollection) {
      const tx = await nftContract.createToken(tokenUri, artist, bips);
      const receipt = await tx.wait();
      console.log(receipt);
      nftContract.on("NFTMinted", (_tokenId, _minter) => {
        console.log("nft minted event, tokenId : " + _tokenId);
        setTokenId(_tokenId);
        createMarketItem(
          _tokenId,
          artist,
          3600 * 24 * days,
          minIncrement,
          directBuyPrice,
          startPrice,
          chosenCollection.id
        );
      });
    }
  }
  async function createMarketItem(
    tokenId,
    artist,
    endTime,
    minIncrement,
    directBuyPrice,
    startPrice,
    collectionId
  ) {
    console.log("create market item");
    const tx = await marketContract.addItemToMarketAndStartAuction(
      process.env.REACT_APP_NFT_ADDRESS,
      tokenId,
      artist,
      endTime,
      minIncrement,
      directBuyPrice,
      startPrice,
      collectionId,
      { value: ethers.utils.parseEther("0") }
    );
    const receipt = await tx.wait();
    console.log(receipt);
  }
  async function handleCreateButton() {
    mintNft(tokenUri, artist, bips * 100);
  }

  useEffect(() => {
    async function fillChainValues() {
      const _signerAddress = await signer.getAddress();
      setSignerAddress(_signerAddress);
      const _collectionsLen = (
        await marketContract._collectionsLen()
      ).toNumber();
      const newMyColelctions = [];
      for (let i = 0; i < _collectionsLen; i++) {
        const collection = await marketContract.collectionInfos(i + 1);
        if (collection.collectionOwner === _signerAddress) {
          newMyColelctions.push({
            id: i + 1,
            name: collection.name,
          });
        }
      }
      setMyCollections(newMyColelctions);
    }
    fillChainValues();
  }, []);

  function convert(){
    console.log(ethers.utils.parseEther("0.000001"))
  }

  return (
    <div className="create-item">
      <Header />

      <section className="flat-title-page inner">
        <div className="overlay"></div>
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="page-title-heading mg-bt-12">
                <h1 className="heading text-center">Create Item</h1>
              </div>
              <div className="breadcrumbs style2">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="#">Pages</Link>
                  </li>
                  <li>Create Item</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="tf-create-item tf-section">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12">
              <div className="form-create-item">
                <div className="flat-tabs tab-create-item">
                  <Tabs>
                    <form action="#">
                      <h4 className="title-create-item">Token URI</h4>
                      <input
                        onChange={uriInputHandler}
                        type="text"
                        placeholder="IPFS URL For Token URI"
                      />

                      <h4 className="title-create-item">Artist</h4>
                      <input
                        onChange={artistInputHandler}
                        type="text"
                        placeholder="Account address of the artist"
                      />

                      <div className="row-form style-3">
                        <div className="inner-row-form">
                          <h4 className="title-create-item">Royalties</h4>
                          <input
                            onChange={bipsInputHandler}
                            type="text"
                            placeholder="5%"
                          />
                        </div>
                        <div className="inner-row-form">
                          <h4 className="title-create-item">Days</h4>
                          <input type="text" placeholder="No of days for auction" 
                          onChange={(e) => {setDays(e.target.value)}}/>
                        </div>
                        <div className="inner-row-form style-2">
                          <div className="seclect-box">
                            <div id="item-create" className="dropdown">
                              <Link to="#" className="btn-selector nolink">
                                {myCollections.length > 0
                                  ? chosenCollection === undefined
                                    ? "Choose Collection"
                                    : chosenCollection.name
                                  : "You have no collections yet"}
                              </Link>
                              <ul>
                                {myCollections.map((item, index) => (
                                  <li
                                    onClick={() => {
                                      setChosenCollection(item);
                                    }}
                                    key={index}
                                  >
                                    <span>{item.name}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row-form style-3" style={{marginTop: "20px"}}>
                        <div className="inner-row-form">
                          <h4 className="title-create-item">Start Price</h4>
                          <input
                            onChange={(e) => {
                              setStartPrice(ethers.utils.parseEther(e.target.value))
                            }}
                            type="number"
                            placeholder="0.01 ETH"
                          />
                        </div>
                        <div className="inner-row-form">
                          <h4 className="title-create-item">
                            Minimum Increment
                          </h4>
                          <input type="text" placeholder="0.001 ETH" 
                          onChange={(e) => {setMinIncrement(
                            ethers.utils.parseEther(e.target.value)
                          )}}/>
                        </div>
                        <div className="inner-row-form">
                          <h4 className="title-create-item">Direct Buy Price</h4>
                          <input
                            onChange={(e) => {setDirectBuyPrice(
                              ethers.utils.parseEther(e.target.value)
                            )}}
                            type="number"
                            placeholder="1 ETH"
                          />
                        </div>
                      </div>
                    </form>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleCreateButton}
          style={{ marginTop: "40px", marginLeft: "15px" }}
        >
          Create item
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default CreateItem;
