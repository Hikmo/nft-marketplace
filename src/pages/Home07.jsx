import React from "react";
import { useLocation } from "react-router-dom";
import HeaderStyle2 from "../components/header/HeaderStyle2";
import Footer from "../components/footer/Footer";
import Category from "../components/layouts/home-7/Category";
import LiveAuction from "../components/layouts/home-7/LiveAuction";
import TopSeller from "../components/layouts/home-7/TopSeller";
import SliderStyle4 from "../components/slider/SliderStyle4";
import TodayPicks from "../components/layouts/home-7/TodayPicks";
import Create from "../components/layouts/home-7/Create";

const Home07 = () => {
  const location = useLocation();
  const collectionId = location.state?.collectionId ?? 1;
  return (
    <div className="home-7">
      <HeaderStyle2 />
      <SliderStyle4 />
      <TodayPicks collectionId={collectionId} />
      <LiveAuction />
      <Create />
      <Footer />
    </div>
  );
};

export default Home07;
