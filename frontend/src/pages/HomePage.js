import React from 'react';
import './HomePage.css'; // Import the CSS file
import { Link } from 'react-router-dom';
import Carousel from '../components/Banner';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import CustomerCard from '../components/CustomerCard'

const HomePage = () => {
  return (
    <div  className="container-fluid" >

     <Navbar/> 
     <Carousel/>

      <section className="insurance-options">
        <div className="option-card">
        <Link to="/car-insurance" className="option-card text-decoration-none text-dark">
          <img src="https://www.insurancedekho.com/pwa/img/v2_icon_car.svg" alt="Car Insurance" />
          <h3>Car Insurance</h3>
          <p>Insurance</p>
        </Link>
        </div>
        <div className="option-card">
        <Link to="/bike-insurance" className="option-card text-decoration-none text-dark">
          <img src="https://www.insurancedekho.com/pwa/img/v2_icon_bike.svg" alt="Bike Insurance" />
          <h3>Bike Insurance</h3>
          <p>Insurance</p>
          </Link>
        </div>
        
        <div className="option-card">
        <Link to="/health-insurance" className="option-card text-decoration-none text-dark">
          <img src="https://www.insurancedekho.com/pwa/img/v2_icon_health.svg" alt="Health Insurance" />
          <h3>Health Insurance</h3>
          <p>Insurance</p>
        </Link>
        </div>
        <div className="option-card">
        <Link to="/term-insurance" className="option-card text-decoration-none text-dark">
          <img src="https://www.insurancedekho.com/pwa/img/v2_icon_life.svg" alt="Term Insurance" />
          <h3>Term Insurance</h3>
          <p>Insurance</p>
          </Link>
        </div>
        <div className="option-card">
        <Link to="/investment-insurance" className="option-card text-decoration-none text-dark">
          <img src="https://www.insurancedekho.com/pwa/img/v2_icon_investment.svg" alt="Investment" />
          <h3>Investment</h3>
          <p>More</p>
          </Link>
        </div>
        <div className="option-card">
        <Link to="/health-insurance" className="option-card text-decoration-none text-dark">
          <img src="https://www.insurancedekho.com/pwa/img/v2_icon_family.svg" alt="Family Health Insurance" />
          <h3>Family Health Insurance</h3>
          <p>Insurance</p>
          </Link>
        </div>
        
        <div className="option-card">
        <Link to="/gaurented-insurance" className="option-card text-decoration-none text-dark">
          <img src="https://www.insurancedekho.com/pwa/img/v2_icon_guaranteeReturn.svg" alt="Guaranteed Return Plans" />
          <h3>Guaranteed Return Plans</h3>
          <p>Return Plans</p>
          </Link>
        </div>
        <div className="option-card">
          <img src="https://static.insurancedekho.com/pwa/img/v2_icon_viewmore.svg" alt="View More" />
          <h3>View More</h3>
        </div>
      </section>

      <section className="highlights">
        <div className="highlight-item">
          <img src="https://static.insurancedekho.com/pwa/img/v2_icon_happysmiles.svg" alt="80 Lacs+ Happy Families" />
          <p>
            <strong>80 Lacs+</strong>
          </p>
          <p>Happy Families</p>
        </div>
        <div className="highlight-item">
          <img src="https://static.insurancedekho.com/pwa/img/v2_icon_Grating.svg" alt="4.8 Stars on Google" />
          <p>
            <strong>4.8</strong>
          </p>
          <p>Rated on Google</p>
        </div>
        <div className="highlight-item">
          <img src="https://static.insurancedekho.com/pwa/img/v2_icon_claimsetteled_3.svg" alt="35k+ Claims Served" />
          <p>
            <strong>35k+</strong>
          </p>
          <p>Claims Served</p>
        </div>
      </section>

      <section className="benefits">
        <h2>Benefits of InsuranceDekho</h2>
        <p>
          Understand your insurance policy options. Identify the best value.
          Enjoy peace of mind.
        </p>
        <div className="benefits-content row">
            <div className="benefit-item col-md-4">
                <img src="https://static.insurancedekho.com/pwa/img/benifitimg1.svg" alt="..." />
                <h3>5 Minutes Policy Issuance*</h3>
                <p>Say no to spending hours and days in queues doing the paperwork for your insurance policy. Get your insurance issued instantly with InsuranceDekho. The entire process from selecting the best insurance policy to getting it issued takes just 5 minutes on InsuranceDekho.</p>
            </div>
            <div className="benefit-item col-md-4">
                <img src="https://static.insurancedekho.com/pwa/img/benifitimg2.svg" alt="..." />
                <h3>Over 80 Lac+ Happy Customers</h3>
                <p>InsuranceDekho, is becoming a household name in India. Till now, we have been successful in providing a delightful experience to more than 50 lac customers with the help of our transparent and quick process, a dedicated support team along with the availability of numerous insurers.</p>
            </div>
            <div className="benefit-item col-md-4">
                <img src="https://static.insurancedekho.com/pwa/img/benifitimg3.svg" alt="..." />
                <h3>Dedicated Support Team</h3>
                <p>Our dedicated support team is available for your assistance all the 7 days. Feel free to reach out to us in case of any confusion - be it related to the purchase of an insurance policy or assistance during the settlement of a claim, our team of experts is at your service all days.</p>
            </div>
        </div>
        </section>




        <section className="how-it-works py-5">
        <h2 className="text-center mb-4">How InsuranceDekho Works?</h2>
        <div className="row how-it-works-content">
            <div className="work-item col-md-4 mb-4 text-center">
            <img src="https://static.insurancedekho.com/pwa/img/HowIDwork_img1.svg" alt="Fill in Your Details" />
            <h3>Fill in Your Details</h3>
            <p>Get insurance policy premium quotes from top-rated insurers instantly.</p>
            </div>
            <div className="work-item col-md-4 mb-4 text-center">
            <img src="https://static.insurancedekho.com/pwa/img/HowIDwork_img2.svg" alt="Select a Plan" />
            <h3>Select a Plan</h3>
            <p>Choose the one that best suits your requirements and budget.</p>
            </div>
            <div className="work-item col-md-4 mb-4 text-center">
            <img src="https://static.insurancedekho.com/pwa/img/benifitimg3.svg" alt="Make Payment and Sit Back" />
            <h3>Make Payment and Sit Back</h3>
            <p>Pay online and get your policy right away in your inbox.</p>
            </div>
        </div>
        </section>
        <CustomerCard/>
        <Footer/>

    </div>
  );
};

export default HomePage;