import React, { useState } from 'react';
import '../NewsCard.css'; // Reuse the same styles
import bikeArticleData from '../../newsdata/bikeNewsData.json'; // path to your bike news JSON
import Footer from '../Footer';
import Navbar from '../Navbar';

const BikeNewsCard = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!bikeArticleData || bikeArticleData.length === 0) {
    return <div>Loading...</div>;
  }

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div>
      <Navbar />

      <div className="news-card-container">
        {bikeArticleData.map((article, index) => {
          const bikeInfo = article.BikeInsuranceInformation;
          if (!bikeInfo) return null;

          const {
            title,
            author,
            date,
            description,
            imageUrl,
            category,
            ...rest
          } = bikeInfo;

          const formattedDate = new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });

          const isExpanded = expandedIndex === index;

          const sectionKeys = Object.keys(rest)
            .filter((key) => key.startsWith('heading'))
            .map((key) => key.replace('heading', ''));

          return (
            <div
              key={index}
              className={`news-card ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleExpand(index)}
            >
              <img src={imageUrl} alt={title} className="news-card-image" />

              <div className="news-card-content">
                <h3 className="news-card-title">{title}</h3>
                <p className="news-card-description">{description}</p>

                <div className="news-card-footer">
                  <div className="news-avatar">{author.charAt(0)}</div>
                  <div className="news-author-info">
                    <div className="news-author-name">{author}</div>
                    <div className="news-date">{formattedDate}</div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="news-expanded-content">
                    {sectionKeys.map((key) => {
                      const heading = bikeInfo[`heading${key}`];
                      const content = bikeInfo[`content${key}`];
                      return (
                        <div key={key} className="news-section">
                          <h4 className="news-section-heading">{heading}</h4>
                          <p className="news-section-content">
                            {content.split('\n').map((line, i) => (
                              <span key={i}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default BikeNewsCard;
