import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Button, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./Results.css";
import { useNavigate } from 'react-router-dom';
import ArticleContext from './ArticleContext';
import NavBar from "./NavBar";
import Card from './ArticleCard';

const Results = () => {
    const [data, setData] = useContext(ArticleContext);
    const [results, setResults] = useState([]);
    const [articleScores, setArticleScores] = useState([]);
    const navigate = useNavigate();

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

    // Load cache from localStorage on page load
    const loadCache = () => {
        const storedCache = localStorage.getItem("articleCache");
        return storedCache ? new Map(JSON.parse(storedCache)) : new Map();
    };

    // Save cache to localStorage whenever an article is analyzed
    const saveCache = () => {
        localStorage.setItem("articleCache", JSON.stringify([...articleCache]));
    };

    // Use localStorage cache in your app
    const articleCache = loadCache();

    const analyzeArticle = async (url) => {
        if (articleCache.has(url)) {
            console.log("Returning cached result for:", url);
            return articleCache.get(url);
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/analyze?url=${url}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();

            const result = {
                url,
                sentiment: ((data?.vader_score + 1) / 2) * 100,
                politicalBias: politicalBias[data?.political_bias] || 50,
            };
            articleCache.set(url, result);
            saveCache(); // Save to localStorage

            return result;
        } catch (error) {
            console.error("Error analyzing article:", error);
            return null;
        }
    };

    // Function to analyze the first 5 articles and store the scores
    const analyzeAllArticles = async () => {
        const articleScores = [];
        for (let i = 0; i < Math.min(5, results.length); i++) {
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

    useEffect(() => {
        if (data && data.keywords && data.keywords[0]) {
            handleSubmitKeyWord(data.keywords[0]);
        }
    }, [data]);

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

    // Prepare data for the chart
    const chartData = articleScores.map((score) => ({
        x: score.politicalBias,  // Political bias (x-axis)
        y: score.sentiment,       // Sentiment bias (y-axis)
        url: score.url,           // URL to link to
    }));
    console.log(data);
    return (<>
            <NavBar></NavBar>
        <div className="background">
             <Card className="sent-card" props={data}/>
        <div className="results-container">
            <h2>Article Bias Results</h2>
            <Row>
           
            {/* Other content such as bias bars and results list */}
            <Col>
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

                {/* Display other bias-related content here */}
            </div>
            </Col>
            <Col>
            {/* Plotting the 2D Coordinate Grid */}
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid />
                        
                        {/* X-Axis: Political Bias */}
                        <XAxis 
                            type="number" 
                            dataKey="x" 
                            name="Political Bias" 
                            domain={[0, 100]} 
                            tickFormatter={(value) => {
                                const labels = ["Left", "Left Lean", "Center", "Right Lean", "Right"];
                                const index = Math.round(value / 25);  // Convert 0-100 scale to 5 labels
                                return labels[index];
                            }} 
                        />
                        
                        {/* Y-Axis: Sentimental Bias */}
                        <YAxis 
                            type="number" 
                            dataKey="y" 
                            name="Sentimental Bias" 
                            domain={[0, 100]} 
                            tickFormatter={(value) => {
                                const labels = ["Very Negative", "Slightly Negative", "Neutral", "Slightly Positive", "Very Positive"];
                                const index = Math.round(value / 25);  // Convert 0-100 scale to 5 labels
                                return labels[index];
                            }} 
                        />

                        <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ payload }) => {
                            if (payload && payload.length > 0) {
                                const { url } = payload[0].payload;
                                return (
                                    <div>
                                        <p><strong>Article URL:</strong> <a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>
                                    </div>
                                );
                            }
                            return null;
                        }} />
                        
                        <Scatter name="Articles" data={chartData} fill="#8884d8" />
                        <Legend />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            </Col>
            </Row>
            

        
        </div>
        <Row className="home-button">
            <Button onClick={() => navigate("/")}>
                    Try a different article?
            </Button>
        </Row>
        </div>

    </>

    );
};

export default Results;
