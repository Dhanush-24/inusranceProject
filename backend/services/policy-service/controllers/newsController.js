const News = require('../DataModels/newsSchema'); // Import the News model

exports.createNews = async (req, res) => {
  const { title, author, date, description, imageUrl, category } = req.body;

  try {
    // Create a new news article using the News model
    const news = new News({
      title,
      author,
      date,
      description,
      imageUrl,
      category
    });

    // Save the news article to the database
    await news.save();

    res.status(201).json({ message: 'News article created successfully!', news });
  } catch (error) {
    console.error('Error saving news article:', error);
    res.status(500).json({ message: 'Error saving news article' });
  }
};
;


// Controller to fetch all news articles (optional)
exports.getAllNews = async (req, res) => {
  try {
    const newsArticles = await News.find();
    return res.status(200).json(newsArticles);
  } catch (error) {
    console.error("Error fetching news articles:", error);
    return res.status(500).json({ message: "Error fetching news articles", error });
  }
};
