import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import heroSliderData from '../assets/fake-data/data-slider';
import Slider from '../components/slider/Slider';
import liveAuctionData from '../assets/fake-data/data-live-auction';
import LiveAuction from '../components/layouts/LiveAuction';
import Collections  from "../components/layouts/home-7/PopularCollection" ;

const Home01 = () => {
    return (
        <div className='home-1'>
            <Header />
            <Slider data={heroSliderData} />
            <Collections />
            <LiveAuction data={liveAuctionData} />
            <Footer />
        </div>
    );
}

export default Home01;
