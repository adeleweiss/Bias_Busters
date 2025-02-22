import "./article_card.css";
import { useState } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * 
 * @param {*} data includes whatever is given by then
 */
function articleCard(data){
    //const published = data.props.published
    console.log(data)
    return  <>
        <div className="card">
            <Row>
                <p className="card_title">{data.props.title}</p>
            </Row>
            <Row>
                <p className="card_description">{data.props.description}</p>
            </Row>
            <Row className="card_bottom_content">
                <Col>
                    <p className="source_name">{data.props.source.name}</p>
                </Col>
                <Col>
                    <p className="author">{data.props.author}</p>
                    <p className="author">{data.props.published}</p>
                </Col>
            </Row>
        </div>
    </>

}

export default articleCard;