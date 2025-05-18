import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Banner = () => {
  return (
    <div
      id="mainCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="1500" // Auto-slide every 3s
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="https://static.insurancedekho.com/pwa/img/nfo/lic-desktop-banner.png"
            className="d-block w-100"
            alt="Banner 1"
            style={{ height: '200px' }}
          />
        </div>
        <div className="carousel-item">
          <img
            src="https://www.godigit.com/content/dam/godigit/life/explore-li-desktop.png"
            className="d-block w-90"
            alt="Banner 2"
            style={{ height: '200px', objectFit: 'cover' }}
          />
        </div>
        
      </div>

      {/* Navigation buttons */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#mainCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#mainCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Banner;









