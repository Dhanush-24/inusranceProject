import React from 'react';
import { Link } from 'react-router-dom';
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
          <Link to="/gaurented-insurance">
            <img
              src="https://static.insurancedekho.com/pwa/img/nfo/lic-desktop-banner.png"
              className="d-block w-100"
              alt="Banner 1"
              style={{ height: '250px', cursor: 'pointer' }}
            />
          </Link>
        </div>
        <div className="carousel-item">
          <Link to="/car-insurance">
            <img
              src="https://www.libertyinsurance.in/images/car-insurance-banner-new.jpg"
              className="d-block w-100"
              alt="Banner 2"
              style={{ height: '250px', objectFit: 'cover', cursor: 'pointer' }}
            />
          </Link>
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









