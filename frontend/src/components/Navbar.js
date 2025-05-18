import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import { Modal, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('adminToken');

  const handleLoginClick = () => setShowRoleModal(true);

  const handleUserLogin = ({ name, mobile }) => {
    login({ name, mobile });
  };

  const handleProfileClick = () => {
    if (user?.mobile) navigate(`/dashboard/${user.mobile}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDownloadQuote = async () => {
    if (!user?.mobile) {
      alert('Please login to download your policy quote.');
      return;
    }

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/payment/payment-details/${user.mobile}`);
      const payments = res.data.data || [];

      if (payments.length === 0) {
        alert("No payment history found.");
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("InsuranceDekho - Payment Quote", 14, 20);
      doc.setFontSize(12);
      doc.text(`Name: ${user.name}`, 14, 30);
      doc.text(`Mobile: ${user.mobile}`, 14, 36);

      const rows = payments.map((payment, index) => [
        index + 1,
        payment.policyType || '-',
        payment.contact || '-',
        payment.orderId || '-',
        payment.method || '-',
        `₹${payment.amount || 0}`,
        payment.paymentId || '-',
      ]);

      autoTable(doc, {
        startY: 50,
        head: [['#', 'Policy Type','Contact','Order Id', 'Method', 'Premium', 'Txn ID']],
        body: rows,
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 35 },
          4: { cellWidth: 25 },
          5: { cellWidth: 30 },
          6: { cellWidth: 30 },
        },
      });

      doc.save(`payment-summary-${user.mobile}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Could not fetch or generate payment summary.");
    }
  };

  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-2">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src="https://static.insurancedekho.com/pwa/img/id-main-logo.svg"
            alt="InsuranceDekho Logo"
            height="30"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-3 px-9">
            {!isAdmin && (
              <>
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle btn btn-link fw-bold"
                    id="dropdownInsurance"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Insurance
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownInsurance">
                    <li><Link className="dropdown-item" to="/car-insurance">Car Insurance</Link></li>
                    <li><Link className="dropdown-item" to="/bike-insurance">Bike Insurance</Link></li>
                    <li><Link className="dropdown-item" to="/health-insurance">Health Insurance</Link></li>
                    <li><Link className="dropdown-item" to="/health-insurance">Family Health Insurance</Link></li>
                    <li><Link className="dropdown-item" to="/term-insurance">Term Insurance</Link></li>
                    <li><Link className="dropdown-item" to="/investment-insurance">Investment</Link></li>
                    <li><Link className="dropdown-item" to="/gaurented-insurance">Guaranteed Returns</Link></li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle btn btn-link fw-bold"
                    id="dropdownAdvisors"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Insurance Advisors
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownAdvisors">
                    <li><Link className="dropdown-item" to="/advisors?type=car-insurance&city=Delhi">Insurance Advisor (Delhi)</Link></li>
                    <li><Link className="dropdown-item" to="/advisors?type=bike-insurance&city=Mumbai">Insurance Advisor (Mumbai)</Link></li>
                    <li><Link className="dropdown-item" to="/advisors?type=health-insurance&city=Bangalore">Insurance Advisor (Bangalore)</Link></li>
                    <li><Link className="dropdown-item" to="/advisors?type=family-health-insurance&city=Chennai">Insurance Advisor (Chennai)</Link></li>
                    <li><Link className="dropdown-item" to="/advisors?type=term-insurance&city=Andhra Pradesh">Insurance Advisor (Andhra Pradesh)</Link></li>
                    <li><Link className="dropdown-item" to="/advisors?type=investment-insurance&city=Telangana">Insurance Advisor (Telangana)</Link></li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle btn btn-link fw-bold"
                    id="dropdownSupport"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Support
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownSupport">
                    <li>
                      <button className="dropdown-item" onClick={handleDownloadQuote}>
                        Download Policy
                      </button>
                    </li>
                    <li>
                      <a className="dropdown-item" href="tel:7551196989">
                        Call us: 7551196989
                      </a>
                    </li>
                  </ul>
                </li>
              </>
            )}

            <li className="nav-item dropdown">
              <button className="nav-link dropdown-toggle btn btn-link fw-bold"
                id="dropdownNews"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                News
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownNews">
                <li><Link className="dropdown-item" to="/news">Car Insurance</Link></li>
                <li><Link className="dropdown-item" to="/bikeNews">Bike Insurance</Link></li>
                <li><Link className="dropdown-item" to="/healthNews">Health Insurance</Link></li>
                <li><Link className="dropdown-item" to="/termNews">Term Insurance</Link></li>
                <li><Link className="dropdown-item" to="/businessNews">Business Insurance</Link></li>
                <li><Link className="dropdown-item" to="/investmentNews">Investment</Link></li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center gap-3 px-1">
          {!isAdmin && (
            <button
              className="btn btn-link fw-bold text-decoration-none"
              onClick={handleDownloadQuote}
            >
              Track & Policy Quote
            </button>
          )}

          {isAdmin ? (
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-danger" size="sm">
                Admin
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login');
                  }}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : user ? (
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-primary" size="sm">
                Hi, {user?.name || 'Guest'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleProfileClick}>
                  Go to Dashboard
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Role Selection Modal */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Login Type</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-around">
          <Button
            variant="primary"
            onClick={() => {
              setShowRoleModal(false);
              setShowLoginModal(true);
            }}
          >
            User
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowRoleModal(false);
              navigate('/admin/login');
            }}
          >
            Admin
          </Button>
        </Modal.Body>
      </Modal>

      <LoginModal
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
        onLogin={handleUserLogin}
      />
    </nav>
  );
};

export default Navbar;
