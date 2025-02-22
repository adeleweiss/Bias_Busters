import './Home.css';
import { motion } from "framer-motion";
import { useState } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";

function Home() {
    const [url, setUrl] = useState("");
    const [submittedUrl, setSubmittedUrl] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmittedUrl(url);
    };

    return (
        <Container className="">
            <div className="fullscreen-section">
                <Row>
                    <Col className="align-self-start">
                        <motion.p
                            initial={{ opacity: 0, y: -100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.75 }}
                            className="text-4xl font-bold title"
                        >
                            Bias Busters
                        </motion.p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="url"
                        >
                            
                            <form onSubmit={handleSubmit} className="">
                                <Button
                                        type="submit">
                                        Search By URL
                                    </Button>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Enter a URL..."
                                    required
                                />
                                
                            </form>
                            {submittedUrl && (
                                <p className="mt-4 text-green-600">Submitted URL: {submittedUrl}</p>
                            )}
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
                                        type="submit">
                                        Search By Title
                                    </Button>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Enter a Title..."
                                    required
                                />
                                
                            </form>
                            {submittedUrl && (
                                <p className="mt-4 text-green-600">Submitted URL: {submittedUrl}</p>
                            )}
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
                                        type="submit">
                                        Search By Keyword
                                    </Button>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Enter a Keyword..."
                                    required
                                />
                                
                            </form>
                            {submittedUrl && (
                                <p className="mt-4 text-green-600">Submitted URL: {submittedUrl}</p>
                            )}
                        </motion.div>
                    </Col>
                </Row>
            </div>


        </Container>
    );
}

export default Home;