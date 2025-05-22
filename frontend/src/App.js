import React, {  Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Dashboard from './components/Dashboard';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import CarInsurance from './pages/InsurancePages/CarInsurance';
import CarQuote from './pages/InsurancePages/CarQuote';
import BikeInsuranceCard from './pages/InsurancePages/BikeInsurance';
import BikeQuote from './pages/InsurancePages/BikeQuote';
import HealthQuote from './pages/InsurancePages/HealthQuote';
import HealthInsuranceCard from './pages/InsurancePages/HealthInsuranceCard';
import GuaranteedInsuranceCard from './pages/InsurancePages/GaurentedInsuranceCard';
import GuaranteedQuotePage from './pages/InsurancePages/GuaranteedQuotePage';
import InvestmentInsuranceCard from './pages/InsurancePages/InvestmentInsuranceCard';
import InvestmentQuote from './pages/InsurancePages/InvestmentQuote';
import TermInsuranceCard from './pages/InsurancePages/TermInsuranceCard';
import TermQuote from './pages/InsurancePages/TermQuote';
import AdvisorsListPage from "./pages/AdvisorsListPage";
import NewsCard from './components/NewsCard';
import BikeNewsCard from './components/news/BikeNewsCard';
import HealthNewsCard from './components/news/HealthNewsCard';
import TermInsuranceNews from './components/news/TermInsuranceNews';
import BusinessInsuranceNews from './components/news/BusinessInsuranceNews';
import InvestmentInsuranceNews from './components/news/InvestmentInsuranceNews';
import UserLoginPage from './components/UserLoginPage';


const App = () => {
  const userMobile = localStorage.getItem("userMobile");

  return (
    <Router>
      <Suspense fallback={<div>Loading news...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Protect Dashboard route */}
          <Route 
            path="/dashboard" 
            element={userMobile ? <Dashboard mobile={userMobile} /> : <Navigate to="/" />} 
          />

          <Route path="/user-login" element={<UserLoginPage />} />

          {/* Admin & User Pages */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard/:mobile" element={<UserDashboard />} />
          
          {/* Insurance Pages */}
          <Route path="/car-insurance" element={<CarInsurance />} />
          <Route path="/car-quote" element={<CarQuote />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path='/bike-insurance' element={<BikeInsuranceCard/>}/>
          <Route path='/bike-quote' element={<BikeQuote/>}/>
          <Route path='/health-insurance' element={<HealthInsuranceCard/>}/>
          <Route path="/health-quote" element={<HealthQuote/>} />
          <Route path="/gaurented-insurance" element={<GuaranteedInsuranceCard/>}/>
          <Route path="/guaranteed-quote" element={<GuaranteedQuotePage />} />
          <Route path='/investment-insurance' element={<InvestmentInsuranceCard/>}/>
          <Route path='/investment-quote' element={<InvestmentQuote/>}/>
          <Route path='/term-insurance' element={<TermInsuranceCard/>}  />
          <Route path='/term-quote' element={<TermQuote/>} />
          <Route path="/advisors" element={<AdvisorsListPage />} />
          <Route path='/news' element={<NewsCard/>}  />
          <Route path='/bikeNews' element={<BikeNewsCard/>}/>
          <Route path='/healthNews' element={<HealthNewsCard/>}/>
          <Route path='/termNews' element={<TermInsuranceNews/>}   />
          <Route path='/businessNews' element={<BusinessInsuranceNews/>}/>
          <Route path='/investmentNews' element={<InvestmentInsuranceNews/>}/>
          

         </Routes> 
      </Suspense>
    </Router>
  );
};

export default App;
