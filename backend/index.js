const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./services/user-service/routes/authRoutes');
const policyRoutes = require('./services/policy-service/routes/policyRoutes');
const bikePolicyRoutes = require('./services/policy-service/routes/bikePolicyRoutes');
const healthPolicyRoutes = require('./services/policy-service/routes/healthPolicyRoutes');
const termInsuranceRoutes = require('./services/policy-service/routes/termPolicyRoutes');
const investmentRoutes = require('./services/policy-service/routes/investmentPolicyRoutes');
const gaurentedPolicyRoutes =require('./services/policy-service/routes/gaurantedPolicyRoutes');
const adminRoutes = require('./services/admin-service/routes/adminRoutes');
const adminPolicyRoutes=require('./services/admin-service/routes/adminPolicyRoutes')
const adminUserPolicyRoutes = require("./services/admin-service/routes/adminUserPolicyRoutes");
const paymentRoutes = require('./payments/routes/paymentRoutes');
const advisorRoutes=require('./services/policy-service/routes/advisorRoutes')
const  newsRoutes=require('./services/policy-service/routes/newsRoutes')



dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/car', policyRoutes); 
app.use('/api/bike', bikePolicyRoutes);
app.use('/api/health', healthPolicyRoutes);
app.use('/api/term', termInsuranceRoutes);
app.use('/api/investmentPolicy', investmentRoutes);
app.use('/api/guarented-policy', gaurentedPolicyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/policies", adminPolicyRoutes);
app.use("/api/admin", adminUserPolicyRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/advisors', advisorRoutes);
app.use('/api', newsRoutes);




// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
