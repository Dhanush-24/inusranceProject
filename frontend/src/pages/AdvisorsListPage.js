import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdvisorsListPage.css'; // Ensure you add styling for pagination controls
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdvisorsListPage = () => {
  const [filters, setFilters] = useState({ city: '', expertise: [], rating: '' });
  const [advisors, setAdvisors] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const advisorsPerPage = 15; // Show 15 advisors per page

  const cities = ['Delhi', 'Andhra Pradesh', 'Telangana', 'Mumbai', 'Chennai', 'Bangalore'];

  const fetchAdvisors = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/advisors`, {
        params: { ...filters, expertise: filters.expertise.join(',') },
      });
      setAdvisors(res.data);
    } catch (err) {
      console.error('Failed to fetch advisors', err);
    }
  };

  useEffect(() => {
    fetchAdvisors();
  }, [filters]);

  const handleFilterChange = (type, value) => {
    if (type === 'expertise') {
      setFilters((prevFilters) => {
        const updatedExpertise = prevFilters.expertise.includes(value)
          ? prevFilters.expertise.filter((item) => item !== value)
          : [...prevFilters.expertise, value];
        return { ...prevFilters, expertise: updatedExpertise };
      });
    } else {
      setFilters({ ...filters, [type]: value });
    }
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleBookVisit = () => {
    setShowModal(true);
    setTimeout(() => setShowModal(false), 3000); // Auto-close after 3s
  };

  // Pagination logic
  const indexOfLastAdvisor = currentPage * advisorsPerPage;
  const indexOfFirstAdvisor = indexOfLastAdvisor - advisorsPerPage;
  const currentAdvisors = advisors.slice(indexOfFirstAdvisor, indexOfLastAdvisor);

  const totalPages = Math.ceil(advisors.length / advisorsPerPage);

  return (
    <div className="container-fluid advisors-page">
      <Navbar />
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 filter-sidebar">
          <h6 className="fw-bold">Filters</h6>
          <div className="filter-section mb-4">
            <h6 className="section-title">City</h6>
            {cities.map((city) => (
              <div className="form-check" key={city}>
                <input
                  type="radio"
                  id={city}
                  name="city"
                  className="form-check-input"
                  checked={filters.city === city}
                  onChange={() => handleFilterChange('city', city)}
                />
                <label htmlFor={city} className="form-check-label">{city}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Advisor Listings */}
        <div className="col-md-9">
          <h4>Insurance Advisors {filters.city ? `in ${filters.city}` : ''}</h4>
          <p className="text-muted">Find the best insurance experts based on location, expertise, and rating.</p>

          {currentAdvisors.length === 0 && (
            <div className="text-muted mt-4">No advisors found with the selected filters.</div>
          )}

          {currentAdvisors.map((advisor, index) => (
            <div className="card advisor-card mb-4" key={index}>
              <div className="card-body d-flex">
                <img src={advisor.image} alt={advisor.name} className="rounded-circle me-3" width={60} height={60} />
                <div>
                  <h6 className="fw-bold mb-1">{advisor.name}</h6>
                  <div className="text-muted small">Experience {advisor.experience} Yrs | Rating {advisor.rating} ★</div>
                  <span className="badge bg-secondary mt-2">{advisor.expertise}</span>
                  <div className="mt-2 text-danger">{advisor.city}</div>
                </div>
              </div>
              <div className="card-footer text-end">
                <button className="btn btn-danger btn-sm" onClick={handleBookVisit}>Book Home Visit</button>
              </div>
            </div>
          ))}

          {/* Numbered Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls d-flex justify-content-center mt-3">
              <button
                className="btn btn-secondary btn-sm me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              
              {/* Generate Page Numbers */}
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-light'}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="btn btn-secondary btn-sm ms-2"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="thank-you-modal">
            <div className="checkmark-circle">✔</div>
            <h5 className="mt-3 fw-bold">Thank you!</h5>
            <p>We’ve received your request for a home visit. Someone from our team will be connecting with you to schedule it.</p>
            <button className="btn-close-modal" onClick={() => setShowModal(false)}>×</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AdvisorsListPage;
