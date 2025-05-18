const express = require('express');
const router = express.Router();
const Advisor = require('../DataModels/AdvisorSchema');

// GET advisors by city
router.get('/', async (req, res) => {
  const city = req.query.city;
  const query = city ? { city } : {};
  try {
    const advisors = await Advisor.find(query);
    res.json(advisors);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Seed advisors
router.post('/seed', async (req, res) => {
  const data =  [
    // Delhi
    {
      name: "Deepanshu Jaglan",
      experience: 6,
      rating: 4.5,
      city: "Delhi",
      expertise: "Health Insurance",
      image: "/images/deepanshu.jpg"
    },
    {
      name: "Pankaj Singh",
      experience: 2,
      rating: 4.8,
      city: "Delhi",
      expertise: "Life Insurance",
      image: "/images/pankaj.jpg"
    },
    {
      name: "Daya Kishore",
      experience: 15,
      rating: 4.7,
      city: "Delhi",
      expertise: "Health Insurance",
      image: "/images/daya.jpg"
    },

    // Bangalore
    {
      name: "Ankit Rao",
      experience: 5,
      rating: 4.6,
      city: "Bangalore",
      expertise: "Life Insurance",
      image: "/images/ankit.jpg"
    },
    {
      name: "Meena Patil",
      experience: 9,
      rating: 4.9,
      city: "Bangalore",
      expertise: "Investment",
      image: "/images/meena.jpg"
    },
    {
      name: "Vinay Gowda",
      experience: 4,
      rating: 4.4,
      city: "Bangalore",
      expertise: "Health Insurance",
      image: "/images/vinay.jpg"
    },

    // Chennai
    {
      name: "Sowmya Iyer",
      experience: 8,
      rating: 4.9,
      city: "Chennai",
      expertise: "Investment",
      image: "/images/sowmya.jpg"
    },
    {
      name: "Raj Kumar",
      experience: 6,
      rating: 4.6,
      city: "Chennai",
      expertise: "Life Insurance",
      image: "/images/raj.jpg"
    },

    // Mumbai
    {
      name: "Ravi Desai",
      experience: 10,
      rating: 4.7,
      city: "Mumbai",
      expertise: "Health Insurance",
      image: "/images/ravi.jpg"
    },
    {
      name: "Kajal Mehta",
      experience: 3,
      rating: 4.5,
      city: "Mumbai",
      expertise: "Life Insurance",
      image: "/images/kajal.jpg"
    },
    {
      name: "Suresh Pawar",
      experience: 12,
      rating: 4.8,
      city: "Mumbai",
      expertise: "Investment",
      image: "/images/suresh.jpg"
    },

    // Andhra Pradesh
    {
      name: "Lakshmi Reddy",
      experience: 4,
      rating: 4.5,
      city: "Andhra Pradesh",
      expertise: "Life Insurance",
      image: "/images/lakshmi.jpg"
    },
    {
      name: "Prasad Naidu",
      experience: 7,
      rating: 4.6,
      city: "Andhra Pradesh",
      expertise: "Health Insurance",
      image: "/images/prasad.jpg"
    },

    // Telangana
    {
      name: "Mahesh Kumar",
      experience: 7,
      rating: 4.8,
      city: "Telangana",
      expertise: "Investment",
      image: "/images/mahesh.jpg"
    },
    {
      name: "Sneha Rathi",
      experience: 5,
      rating: 4.7,
      city: "Telangana",
      expertise: "Life Insurance",
      image: "/images/sneha.jpg"
    },
    {
      name: "Kiran Reddy",
      experience: 6,
      rating: 4.6,
      city: "Telangana",
      expertise: "Health Insurance",
      image: "/images/kiran.jpg"
    }
  ]
  try {
    await Advisor.deleteMany({});
    await Advisor.insertMany(data);
    res.send("Seeded advisors for all cities.");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
