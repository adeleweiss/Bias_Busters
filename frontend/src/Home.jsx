import './Home.css';
import { motion } from "framer-motion";
import { useState } from 'react';
import { Row, Col, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from './article_card';

function Home() {
    const [url, setUrl] = useState("");
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState([]);

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
            console.log(data);
            
        } catch (er) {
            console.log("Error fetching data:", er);
        }
    };

    const handleSubmitKeyWord = async (e) => {
        e.preventDefault();
        const response = await fetch(`https://newsapi.org/v2/everything?q=${keyword}&sortBy=popularity&apiKey=281e38068b43403e9b7869cfca993a41`, {
            mode: "cors"
        });
        const json = await response.json();
        setResults(json.articles);
    };

    console.log(results)
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
                                        disabled={keyword}>
                                        Search By URL
                                    </Button>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Enter a URL..."
                                    required
                                    className="input"
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
                                        disabled={url}>
                                        Search By Keyword
                                    </Button>
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="Enter a Keyword..."
                                    required
                                    className="input"
                                    disabled={url}
                                />
                                
                            </form>
                        </motion.div>
                    </Col>
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
                {results.map(article =>{
                    return <Card props={article}/>
                })}
            </div>
            }
            </>
    );
}

export default Home;