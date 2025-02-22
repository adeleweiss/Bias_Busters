import { useState } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * 
 * @param {*} data includes whatever is given by then
 */
function articleCard(data){
    console.log(data)
    return  <>
        <div className="card">
            <Row>
                <p>{data.props.title}</p>
            </Row>
            <Row>
                <p>{data.props.description}</p>
            </Row>
            <Row>
                <Col>
                    <p>{data.props.source.name}</p>
                </Col>
                <Col>
                    <p>{data.props.author}</p>
                </Col>
            </Row>
        </div>
    </>

}

export default articleCard;