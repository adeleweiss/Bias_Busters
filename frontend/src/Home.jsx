import './Home.css';
import { motion } from "framer-motion";
import { useState } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [keyword, setKeyword] = useState("");
    const [submittedUrl, setSubmittedUrl] = useState(null);
    const [result, setResult] = useState("");

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

    const handleSubmit = (e) => {
        e.preventDefault();
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
                    <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </motion.div>
                
                </Row>
                <Row>
                    <motion.h3
                    initial={{ opacity: 0, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="subtitle mb-0"
                    >
                        Search for an article using a url, title or keyword.
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
                                        disabled={title || keyword}>
                                        Search By URL
                                    </Button>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Enter a URL..."
                                    required
                                    className="input"
                                    disabled={title || keyword}
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
                            transition={{ duration: 1, delay:0.5 }}
                            className="url"
                        >
                            
                            <form onSubmit={handleSubmit} className="">
                                <Button
                                        variant="light"
                                        type="submit"
                                        disabled={url || keyword}>
                                        Search By Title
                                    </Button>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter a Title..."
                                    required
                                    className="input"
                                    disabled={keyword || url}
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
                            transition={{ duration: 1 , delay: 1}}
                            className="url"
                        >
                            
                            <form onSubmit={handleSubmit} className="">
                                <Button
                                        variant="light"
                                        type="submit"
                                        onSubmit={(e) => handleSubmitUrl(e)}
                                        disabled={title || url}>
                                        Search By Keyword
                                    </Button>
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="Enter a Keyword..."
                                    required
                                    className="input"
                                    disabled={title || url}
                                />
                                
                            </form>
                        </motion.div>
                    </Col>
                    {submittedUrl && (
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
            </>
    );
}

export default Home;