import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { ethers } from "ethers";
import marketData from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

const CreateItem = () => {
  const [description, setDescription] = useState();
  const [img, setImg] = useState();
  const [name, setName] = useState();
  const [artistName, setArtistName] = useState();
  const [artistImg, setArtistImg] = useState();

  function desInputHandler(e) {
    setDescription(e.target.value);
  }

  function nameInputHandler(e) {
    setName(e.target.value);
  }

  function imgInputHandler(e) {
    setImg(e.target.value);
  }

  function artistNameInputHandler(e) {
    setArtistName(e.target.value);
  }

  function artistImgInputHandler(e) {
    setArtistImg(e.target.value);
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const marketContract = new ethers.Contract(
    process.env.REACT_APP_MARKET_ADDRESS,
    marketData.abi,
    signer
  );

  async function createCollection() {
    const tx = await marketContract.createCollection(img, name, artistName, artistImg, description)
    const receipt = await tx.wait()
    console.log(receipt)
  }

  useEffect(() => {}, []);

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
                      <h4 className="title-create-item">Name</h4>
                      <input
                        type="text"
                        placeholder="Name of the collection"
                        onChange={nameInputHandler}
                      />

                      <h4 className="title-create-item">Image Url</h4>
                      <input
                        type="text"
                        placeholder="Image URL of your collection"
                        onChange={imgInputHandler}
                      />

                      <h4 className="title-create-item">Description</h4>
                      <textarea
                        onChange={desInputHandler}
                        placeholder="Describe your collection"
                      ></textarea>

                      <h4 className="title-create-item">Artist Name</h4>
                      <input
                        onChange={artistNameInputHandler}
                        type="text"
                        placeholder="Name of the collecion creator"
                      />

                      <h4 className="title-create-item">Artist Image</h4>
                      <input
                        onChange={artistImgInputHandler}
                        type="text"
                        placeholder="The URL for the image of collection creator"
                      />
                    </form>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={createCollection}
          style={{ marginTop: "40px", marginLeft: "15px" }}
        >
          Create Collection
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default CreateItem;
