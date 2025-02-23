import "/text_bias.css";
import { useState } from 'react';
import { motion } from "framer-motion";
import { Row, Col, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function text_bias(){
    const [userText, setUserText] = useState("");

    const handleSubmitText = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/analyze-text`, {
                method: "POST",
                body: JSON.stringify({
                    text: userText.value
                  }),
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

    return <>
    <div className="fullscreen-section">
        <Row>
            <Col className="align-self-start">
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.75 }}
                >
                    <p className="title">Am I Biased?</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.75, delay: 1.75}}
                >
                    <p className="subtitle">Put your writing to the test, do you know 
                        your political alignment and sentimental bias?</p>
                </motion.div>
                
            </Col>
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
                    <form className="">
                        <textarea
                            cols="50"
                            type="text"
                            value={userText}
                            placeholder="Enter your text here"
                            onChange={(e) => setUserText(e.target.value)}
                            required
                            className="input"
                        />
                        <Button
                            variant="light"
                            type="submit"
                            onClick={handleSubmitText}
                        >
                                Rate my writing
                        </Button>
                    </form>
                </motion.div>
            </Col>
        </Row>
    </div>
    </>

}