import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import marketData from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { ethers } from "ethers";

const PopularCollection = () => {
  const navigate = useNavigate();

  const [collectionInfos, setCollectionInfos] = useState([]);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const marketContract = new ethers.Contract(
    process.env.REACT_APP_MARKET_ADDRESS,
    marketData.abi,
    signer
  );
  // colll 3 l var dikkat diğer dosyada da var
  useEffect(() => {
    async function fillChainValues() {
      const collectionsLen = (
        await marketContract._collectionsLen()
      ).toNumber();
      console.log(collectionsLen);
      const newCollectionInfos = [];
      for (let i = 0; i < collectionsLen; i++) {
        const collectionInfo = await marketContract.collectionInfos(i + 1);
        newCollectionInfos[i] = collectionInfo;
      }
      setCollectionInfos(newCollectionInfos);
    }
    fillChainValues();
  }, []);

  const [visible, setVisible] = useState(1);
  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 3);
  };
  return (
    <section className="tf-section live-auctions style4 home4 live-auctions-style7">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-box-12">
            <div className="heading-live-auctions">
              <h2 className="tf-title pb-40 text-left">All Collections</h2>
              <Link to="/explore-03" className="exp style2 mg-t-23">
                EXPLORE MORE
              </Link>
            </div>
          </div>
          {collectionInfos.map((item, index) => (
            <div
              key={index}
              className="fl-collection fl-item3 col-xl-4 col-md-6"
              onClick={() => {
                navigate("/home-07", {
                  state: {
                    collectionId: index + 1,
                  },
                });
              }}
            >
              <div className="sc-card-collection style-2 sc-card-style7">
                <div className="card-media-h7">
                  <img src={item.image} alt="Axies" />
                </div>
                <div className="card-bottom">
                  <div className="author">
                    <div className="content">
                      <h5 style={{ marginTop: "0.5vw" }}>
                        <Link to="#">{item.name}</Link>
                      </h5>
                      <div className="infor">
                        <span>Created by</span>
                        <span className="name">
                          <Link to="#">{item.artistName}</Link>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sc-author-box style-2">
                  {/*  <div className="author-avatar">
                    <img src={item.artistImg} alt="Axies" className="avatar" />
            </div> */}
                </div>
              </div>
            </div>
          ))}
          {visible < collectionInfos.length && (
            <div className="col-md-12 wrap-inner load-more text-center mt-10">
              <Link
                to="#"
                id="load-more"
                className="sc-button loadmore fl-button pri-3"
                onClick={showMoreItems}
              >
                <span>Load More</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularCollection;
