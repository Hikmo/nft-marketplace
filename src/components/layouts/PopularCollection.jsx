import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y } from "swiper";

import marketData from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

const PopularCollection = (props) => {
  const navigate = useNavigate();

  const [collectionInfos, setCollectionInfos] = useState([]);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const marketContract = new ethers.Contract(
    process.env.REACT_APP_MARKET_ADDRESS,
    marketData.abi,
    signer
  );

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

  return (
    <section className="tf-section popular-collection">
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div className="heading-live-auctions">
              <h2 className="tf-title pb-22 text-left">Collections</h2>
              <Link to="/explore-03" className="exp style2">
                EXPLORE MORE
              </Link>
            </div>
          </div>
          <div className="col-md-12">
            <div className="collection">
              <Swiper
                modules={[Navigation, Scrollbar, A11y]}
                spaceBetween={30}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                  },

                  767: {
                    slidesPerView: 2,
                  },

                  991: {
                    slidesPerView: 3,
                  },
                }}
                scrollbar={{ draggable: true }}
              >
                {collectionInfos.map((colInfo, index) => (
                  <SwiperSlide key={index}>
                    <PopularCollectionItem
                      item={{
                        title: colInfo.name,
                        image: colInfo.image,
                        name: colInfo.artistName,
                        onClick: () => {
                          navigate("/home-07", {
                            state: {
                              collectionId: index + 1,
                            },
                          });
                        },
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
PopularCollection.propTypes = {
  data: PropTypes.array.isRequired,
};

const PopularCollectionItem = (props) => (
  <div
    className="swiper-container show-shadow carousel4 button-arow-style"
    onClick={props.item.onClick}
  >
    <div className="swiper-wrapper">
      <div className="swiper-slide">
        <div className="slider-item">
          <div className="sc-card-collection style-2 home2">
            <div className="card-bottom">
              <div className="author">
                <div className="sc-author-box style-2">
                  <div className="author-avatar">
                    <img src={props.item.imgAuthor} alt="" className="avatar" />
                  </div>
                </div>
                <div className="content">
                  <h4>
                    <Link to="/authors-01">{props.item.title}</Link>
                  </h4>
                  <div className="infor">
                    <span>Created by</span>
                    <span className="name">
                      <Link to="/authors-02">{props.item.name}</Link>
                    </span>
                  </div>
                </div>
              </div>
              <Link to="/login" className="wishlist-button public heart">
                <span className="number-like"> 100</span>
              </Link>
            </div>
            <Link to="/authors-02">
              <div className="media-images-collection">
                <div className="box-left">
                  <img src={props.item.imgleft} alt="axies" />
                </div>
                <div className="box-right">
                  <div className="top-img">
                    <img src={props.item.imgright1} alt="axies" />
                    <img src={props.item.imgright2} alt="axies" />
                  </div>
                  <div className="bottom-img">
                    <img src={props.item.imgright3} alt="axies" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PopularCollection;
