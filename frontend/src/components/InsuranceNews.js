import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

const InsuranceNews = ({ query = 'insurance' }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 15; // Show 15 vlogs per page

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        // Dynamic API request based on insurance category
        const res = await axios.get(
          `https://newsapi.org/v2/everything?q=${query}+insurance OR ${query}+policy OR ${query}+claims OR ${query}+tips&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
        );

        if (res.data.articles) {
          // Filter only relevant insurance-related articles
          const filteredArticles = res.data.articles.filter(article =>
            article.title.toLowerCase().includes("insurance") ||
            article.description.toLowerCase().includes("insurance") ||
            article.source.name.toLowerCase().includes("insurance")
          );

          setArticles(filteredArticles);
        }
      } catch (err) {
        console.error('Failed to fetch insurance news:', err);
        setError('Failed to fetch insurance-related vlogs');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  // Pagination Logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  return (
    <div className="container mt-4">
      <Navbar />
      <h4 className="mb-3">{query.charAt(0).toUpperCase() + query.slice(1)} Insurance News</h4>
      <div className="row">
        {currentArticles.length > 0 ? (
          currentArticles.map((article, i) => (
            <div className="col-md-12 mb-4" key={i}>
              <div className="card border-0 shadow-sm p-3">
                <div className="row g-0">
                  {article.urlToImage && (
                    <div className="col-md-3">
                      <img src={article.urlToImage} className="img-fluid rounded" alt={article.title} />
                    </div>
                  )}
                  <div className="col-md-9">
                    <div className="card-body">
                      <h6 className="card-title">{article.title}</h6>
                      <p className="text-muted small">
                        {article.author ? `By ${article.author}` : 'Unknown Author'} | {new Date(article.publishedAt).toLocaleDateString()}
                      </p>
                      <p className="card-text">{article.description}</p>
                      <a href={article.url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted">No insurance vlogs found.</div>
        )}
      </div>

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
      <Footer />
    </div>
  );
};

export default InsuranceNews;
