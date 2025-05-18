import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="top-footer">
        <div className="footer-section">
          <div className="logo">
            <img src="https://static.insurancedekho.com/pwa/img/id-main-logo.svg" alt="InsuranceDekho Logo" />
          </div>
          <div className="social-links">
            <a href="https://www.facebook.com/InsuranceDekho-362265937686333"><i className="fab fa-facebook-square"></i></a>
            <a href="https://www.twitter.com/insurance_dekho/"><i className="fab fa-twitter"></i></a>
            <a href="https://www.linkedin.com/company/insurancedekho/"><i className="fab fa-linkedin"></i></a>
            <a href="https://www.youtube.com/channel/UCbgggXkm7oIpqS9ushr4jKw"><i className="fab fa-youtube"></i></a>
            <a href="https://www.instagram.com/insurancedekhoofficial/"><i className="fab fa-instagram"></i></a>
          </div>
          <div className="contact-info">
            <p>
              Email: <a href="mailto:support@insurancedekho.com">support@insurancedekho.com</a>
            </p>
            <p>
              Call: <a href="tel:7551196989">7551196989</a>
            </p>
          </div>
        </div>

        <div className="footer-section">
          <h3>Products</h3>
          <ul>
            <li><a href="#">Car Insurance</a></li>
            <li><a href="#">Health Insurance</a></li>
            <li><a href="#">Life Insurance</a></li>
            <li><a href="#">Term Insurance</a></li>
            <li><a href="#">Investment</a></li>
            <li><a href="#">Business Insurance</a></li>
            <li><a href="#">Travel Insurance</a></li>
            <li><a href="#">Saving Schemes</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Policy</h3>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Grievance Redressal</a></li>
            <li><a href="#">Fraud Detection</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Cancellation & Refund</a></li>
            <li><a href="#">E-Insurance Account</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>General</h3>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Feedback</a></li>
            <li><a href="#">Fraud Identification</a></li>
            <li><a href="#">Disclaimer</a></li>
            <li><a href="#">Annual Reports/Annual Returns</a></li>
            <li><a href="#">Solicitation Process</a></li>
            <li><a href="#">ID Alumni Page</a></li>
            <li><a href="#">Corporate Social Responsibility</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <div className="trust-section">
            <img src="https://static.insurancedekho.com/pwa/img/v2_icon_happysmiles.svg" alt="100 Lacs+ Happy Families" />
            <span>100 Lacs+ Happy Families</span>
          </div>
          <div className="rating-section">
            <img src="https://static.insurancedekho.com/pwa/img/v2_icon_Grating.svg" alt="4.8 Rating on Google" />
            <span>4.8 Rating on Google</span>
          </div>
          <div className="claim-section">
            <img src="https://static.insurancedekho.com/pwa/img/v2_icon_claimsetteled_3.svg" alt="35k+ Claims Served" />
            <span>35k+ Claims Served</span>
          </div>
        </div>
      </div>

      <div className="middle-footer">
        <div className="quick-links">
          <h3>Quick Links</h3>
          <div className="quick-links-section">
            <div>
              <h4>Car Insurance</h4>
              <ul>
                <li><a href="#">Car Insurance</a></li>
                <li><a href="#">Car Insurance Renewal</a></li>
                <li><a href="#">Car Insurance Calculator</a></li>
                <li><a href="#">Zero Depreciation Car Insurance</a></li>
                <li><a href="#">CNG Car Insurance</a></li>
                <li><a href="#">Own Damage Car Insurance</a></li>
                <li><a href="#">Car Insurance Claim Settlement</a></li>
                <li><a href="#">Best Car Insurance Companies</a></li>
              </ul>
            </div>
            <div>
              <h4>Health Insurance</h4>
              <ul>
                <li><a href="#">Health Insurance</a></li>
                <li><a href="#">Best Health Insurance Companies</a></li>
                <li><a href="#">MediClaim Policy</a></li>
                <li><a href="#">Health Insurance Claim Settlement Ratio</a></li>
                <li><a href="#">Critical Illness Health Insurance</a></li>
                <li><a href="#">Health Insurance Premium Calculator</a></li>
                <li><a href="#">Family Health Insurance</a></li>
                <li><a href="#">Senior Citizen Health Insurance</a></li>
              </ul>
            </div>
            <div>
              <h4>Life Insurance</h4>
              <ul>
                <li><a href="#">Postal Life Insurance Scheme</a></li>
                <li><a href="#">Life Insurance Types</a></li>
                <li><a href="#">Term Insurance Claim Settlement Ratio</a></li>
                <li><a href="#">Term Insurance</a></li>
                <li><a href="#">Best Life Insurance Companies</a></li>
                <li><a href="#">Life Insurance Plans</a></li>
                <li><a href="#">Life Insurance Tax Benefits</a></li>
                <li><a href="#">Life Insurance Premium Calculator</a></li>
              </ul>
            </div>
            <div>
              <h4>Investment Plans</h4>
              <ul>
                <li><a href="#">Investment Plans</a></li>
                <li><a href="#">Fixed Deposit Calculator</a></li>
                <li><a href="#">Tax Saving Fixed Deposit</a></li>
                <li><a href="#">Child Investment Plans</a></li>
                <li><a href="#">Best Investment Plans</a></li>
                <li><a href="#">Annuity Plans</a></li>
                <li><a href="#">Section 80C</a></li>
                <li><a href="#">Investment Plans for NRI</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-footer">
        <p>
          *Disclaimer: "We do not sell any kind of motor, health and life insurance or any financial products ourselves. We only facilitate the sale of motor, health and life insurance & financial products by insurers." "Girnar Insurance Brokers Private Limited (CIN U66010HR2012PLC044032) , having its registered office at Plot No. 301, Phase-IV, Sector 44, Gurugram 122002, Haryana, India. Girnar Insurance Brokers Private Limited is licensed by the Insurance Regulatory and Development Authority of India (IRDAI) vide License No 588, valid till 10/03/2026 to act as a Composite Broker."
        </p>
        <p>
          Girnar Insurance Brokers Pvt. Ltd. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
