import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import Header from './Header';
import showcaseImg1 from '../assets/sofa/sofa2.jpg';
import showcaseImg2 from '../assets/sofa/Sofa4.webp';
import showcaseImg3 from '../assets/office/of1.jpg';
import showcaseImg4 from '../assets/office/of2.jpg';
import showcaseImg5 from '../assets/table/coffee table.jpg';
import showcaseImg6 from '../assets/table/side table.jpg';
import InfoCards from './InfoCards';
import SocialNewsletterBar from './SocialNewsletterBar';
import Footer from './Footer';

// Demo: Each furniture item has its own array of images
const furnitureData = [
  {
    name: 'Sofa',
    images: [showcaseImg1, showcaseImg2],
    category: 'sofa'
  },
  {
    name: 'office Table',
    images: [showcaseImg3, showcaseImg4],
    category: 'office'
  },
  {
    name: 'Chair',
    images: [showcaseImg5, showcaseImg6],
    category: 'chair'
  },
];

const MainPage = () => {
  const navigate = useNavigate();
  // Track current slide for each furniture block
  const [currentIndexes, setCurrentIndexes] = useState(Array(furnitureData.length).fill(0));
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const intervals = useRef([]);

  const handlePrev = (blockIdx) => {
    setCurrentIndexes((prev) =>
      prev.map((idx, i) =>
        i === blockIdx ? (idx === 0 ? furnitureData[blockIdx].images.length - 1 : idx - 1) : idx
      )
    );
  };

  const handleNext = (blockIdx) => {
    setCurrentIndexes((prev) =>
      prev.map((idx, i) =>
        i === blockIdx ? (idx === furnitureData[blockIdx].images.length - 1 ? 0 : idx + 1) : idx
      )
    );
  };

  const handleDotClick = (blockIdx, imgIdx) => {
    setCurrentIndexes((prev) => prev.map((idx, i) => (i === blockIdx ? imgIdx : idx)));
  };

  const handleMouseEnter = (blockIdx) => {
    setHoveredIndex(blockIdx);
    // Start auto-slide for this block
    clearInterval(intervals.current[blockIdx]);
    intervals.current[blockIdx] = setInterval(() => {
      setCurrentIndexes((prev) =>
        prev.map((idx, i) =>
          i === blockIdx
            ? (idx === furnitureData[blockIdx].images.length - 1 ? 0 : idx + 1)
            : idx
        )
      );
    }, 750);
  };

  const handleMouseLeave = (blockIdx) => {
    setHoveredIndex(null);
    clearInterval(intervals.current[blockIdx]);
  };

  const handleImageClick = (category) => {
    navigate('/products');
  };

  // Clean up intervals on unmount
  React.useEffect(() => {
    return () => {
      intervals.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  return (
    <>
      <Header />
      <div className="main-showcase-vertical">
        {furnitureData.map((item, blockIdx) => (
          <div className="main-showcase-container" key={blockIdx}>
            <button
              className="arrow left-arrow"
              aria-label="Previous"
              onClick={() => handlePrev(blockIdx)}
            >
              &#x276E;
            </button>
            <div
              className="showcase-image-wrapper"
              onMouseEnter={() => handleMouseEnter(blockIdx)}
              onMouseLeave={() => handleMouseLeave(blockIdx)}
            >
              <img
                src={item.images[currentIndexes[blockIdx]]}
                alt={`${item.name} ${currentIndexes[blockIdx] + 1}`}
                className={`showcase-image ${hoveredIndex === blockIdx ? 'zoom-in' : ''} clickable`}
                onClick={() => handleImageClick(item.category)}
                style={{ cursor: 'pointer' }}
              />
              <div className="slide-dots">
                {item.images.map((_, imgIdx) => (
                  <span
                    key={imgIdx}
                    className={`dot${currentIndexes[blockIdx] === imgIdx ? ' active' : ''}`}
                    onClick={() => handleDotClick(blockIdx, imgIdx)}
                  />
                ))}
              </div>
            </div>
            <button
              className="arrow right-arrow"
              aria-label="Next"
              onClick={() => handleNext(blockIdx)}
            >
              &#x276F;
            </button>
          </div>
        ))}
      </div>
      <SocialNewsletterBar />
      <InfoCards />
      <Footer />
    </>
  );
};

export default MainPage; 