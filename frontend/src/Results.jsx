import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./Results.css";

const Results = () => {
  const location = useLocation();
  const { data } = location.state || {};

  // State to hold the articles fetched via keyword search
  const [results, setResults] = useState([]);
  const [articleScores, setArticleScores] = useState([]);
  
  // Function to fetch articles based on a keyword
  const handleSubmitKeyWord = async (keyword) => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${keyword}&sortBy=popularity&apiKey=281e38068b43403e9b7869cfca993a41`,
        {
          mode: "cors",
        }
      );
      const json = await response.json();
      setResults(json.articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  // Fetch sentiment and political bias for each article
  const analyzeArticle = async (url) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/analyze?url=${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return {
        url,
        sentiment: ((data.vader_score + 1) / 2) * 100 ,
        politicalBias: politicalBias[data?.political_bias],
      };
    } catch (error) {
      console.error("Error analyzing article:", error);
      return null;
    }
  };

  // Function to analyze the first 5 articles and store the scores
    const analyzeAllArticles = async () => {
        const articleScores = [];
        // Limit to first 5 articles
        for (let i = 0; i < Math.min(10, results.length); i++) {
            const article = results[i];
            if (article.urlToImage !== null) {
                const score = await analyzeArticle(article.url);
                if (score) {
                articleScores.push(score);
                }
            }
        }
        setArticleScores(articleScores);
    };
  // Call the keyword search when the component mounts (or when data changes)
  useEffect(() => {
    if (data && data.keywords && data.keywords[0]) {
      handleSubmitKeyWord(data.keywords[0]);
    }
  }, [data]);
  
  // Call analyzeAllArticles after results are fetched
  useEffect(() => {
    if (results.length > 0) {
      analyzeAllArticles();
    }
  }, [results]);
  
  // Define political bias mapping
  const politicalBias = {
    left: 10,
    "lean left": 30,
    center: 50,
    "lean right": 70,
    right: 90,
  };

  // Map bias values (defaulting to 50 if data isn't available)
  const mappedPoliticalBias = politicalBias[data?.political_bias] || 50;
  const sentimentalBias = ((data?.vader_score + 1) / 2) * 100 || 50;

  return (
    <Container className="results-container">
      <h2>Article Bias Results</h2>

      <div className="bias-section">
        {/* Political Bias Bar */}
        <p>
          <strong>Political bias:</strong>
        </p>
        <div className="bias-bar">
          <div className="bias-fill political"></div>
          <div
            className="bias-marker"
            style={{ left: `${mappedPoliticalBias}%` }}
          ></div>
        </div>
        <div className="bias-labels">
          <span>Liberal</span>
          <span>Conservative</span>
        </div>

        {/* Sentimental Bias Bar */}
        <p>
          <strong>Sentimental bias:</strong>
        </p>
        <div className="bias-bar">
          <div className="bias-fill sentimental"></div>
          <div
            className="bias-marker"
            style={{ left: `${sentimentalBias}%` }}
          ></div>
        </div>
        <div className="bias-labels">
          <span>Negative</span>
          <span>Positive</span>
        </div>


        {/* Display keyword search results */}
        <div className="results-list">
            {results && results.length > 0 ? (
            results
              .filter((article) => article.urlToImage !== null)
              .slice(0, 5)
              .map((article, index) => {
                const score = articleScores.find(
                  (score) => score.url === article.url
                );

                return (
                  <div key={index} className="article">
                    <p>{article.url}</p>
                    {score && (
                      <div>
                        <p>Sentiment Score: {score.sentiment}</p>
                        <p>Political Bias: {score.politicalBias}</p>
                      </div>
                    )}
                  </div>
                );
              })
          ) : (
            <p>No keyword articles found</p>
            )}
      </div>

        
      </div>
    </Container>
  );
};

export default Results;
