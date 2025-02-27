import './Home.css';
import { motion } from "framer-motion";
import { useState, useContext, useEffect } from 'react';
import { Row, Col, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from './ArticleCard';
import ArticleContext from './ArticleContext';

function Home() {
    const [url, setUrl] = useState("");
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState([]);
    const [data, setData] = useContext(ArticleContext);
    const [showButton, setShowButton] = useState(false);
    const navigate = useNavigate();

    const handleSubmitUrl = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/analyze?url=${url}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            setData(data);
            navigate('/results');
        } catch (er) {
            console.log("Error fetching data:", er);
        }
    };

    const handleSubmitKeyUrl = async (e) => {
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/analyze?url=${e}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            setData(data);
            navigate('/results');
        } catch (er) {
            console.log("Error fetching data:", er);
        }
    };

    const handleSubmitKeyWord = async (e) => {
        e.preventDefault();
        const response = await fetch(`https://newsapi.org/v2/everything?q=${keyword}&sortBy=popularity&apiKey=e087a53010b042798763d14eb30e22c1`, {
            mode: "cors"
        });
        const json = await response.json();
        setResults(json.articles);
    };

    //these next three functions were generated by chatGPT, for functionality for the back to top button
    const handleScroll = () => {
        if (window.scrollY > 1000) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);

    const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      };

    return (
        <>
            <div className="fullscreen-section">
                <Row>
                    <Col className="align-self-start">
                        <motion.div
                            initial={{ opacity: 0, y: -100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.75 }}
                        >
                            <p className="title">Bias Busters</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.75, delay: 1.75}}
                        >
                            <p className="subtitle">Who you gonna trust?</p>
                        </motion.div>

                    </Col>

                    <motion.div
                                initial={{ opacity: 0, y: 0 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.75}}
                    >
                    <p className="description">Have you ever felt overwhelmed by a flood of news articles, unsure which ones to trust? We’re here to help. We designed Bias Busters to be an accessible online platform that automatically analyzes the sentiment and political bias in articles. Our mission is to promote critical thinking and foster a more open-minded society, one article at a time.</p>
                    </motion.div>

                </Row>
                <Row>
                    <motion.h3
                    initial={{ opacity: 0, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="subtitle mb-0"
                    >
                        Search for an article using a url or keyword.
                    </motion.h3>
                    <Col>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="url"
                        >            
                            <form onSubmit={handleSubmitUrl} className="">
                                <Button
                                        variant="light"
                                        type="submit"
                                        disabled={keyword}
                                        className="subButtons">
                                        Search By URL
                                    </Button>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Enter a URL..."
                                    required
                                    className="textbox-input"
                                    disabled={keyword}
                                />

                            </form>
                        </motion.div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 , delay: 0.5}}
                            className="url"
                        >

                            <form onSubmit={handleSubmitKeyWord} className="">
                                <Button
                                        variant="light"
                                        type="submit"
                                        onSubmit={(e) => handleSubmitUrl(e)}
                                        disabled={url}
                                        className="subButtons">
                                        Search By Keyword
                                    </Button>
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="Enter a Keyword..."
                                    required
                                    className="textbox-input"
                                    disabled={url}
                                />

                            </form>
                        </motion.div>
                    </Col>
                    </Row>
                    <Row >
                        <Col >
                    <p className="Keywords">Trouble finding articles? Try these Keywords: U.S, World, Health, Business, Art, Sports, Politics</p>
                    </Col>
                    </Row>
                <Row>
                {results.length !== 0 && (
                <motion.div 
                    className='resultsIndicator '
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [1, 0.3, 1] }} // Flashing effect
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <motion.div 
                        animate={{ y: [0, 7, 0] }} 
                        transition={{ duration: 0.8, repeat: Infinity }}
                    >
                        <p className='text-center'>⌄ Scroll Down for Results ⌄</p>
                    </motion.div>
                </motion.div>

            )}
                </Row>
            </div>
            {results.length !== 0 && 
            <div>
                <p className="length-Res">{results.length} Result(s)</p>
                {results.map(article =>{
                    return <motion.div onClick={() => handleSubmitKeyUrl(article.url)}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 , delay: 0.5}}
                    key={article.title}>
                    <Card className="card" props={article}/>
                    </motion.div>
                })}
            </div>
            }
             <button
      className={`backTop ${showButton ? "show" : ""}`}
      onClick={scrollToTop}
      style={{ display: showButton ? "block" : "none"}}
    >
      ↑
    </button>
            </>
    );
}

export default Home;