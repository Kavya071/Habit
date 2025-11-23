import React from 'react';
import Hero from '../components/Hero';
import WhatItIs from '../components/WhatItIs';
import HowItWorks from '../components/HowItWorks';
import Benefits from '../components/Benefits';
import Reviews from '../components/Reviews';
import Investment from '../components/Investment';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <Hero />
      <WhatItIs />
      <HowItWorks />
      <Benefits />
      <Reviews />
      <Investment />
    </div>
  );
}

export default Home;
