import { useState } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * 
 * @param {*} data includes whatever is given by then
 */
function articleCard(data){

    return 
    <>
        <div class="card">
            <Row>
                <p>{data.title}</p>
            </Row>
            <Row>
                <p>{data.description}</p>
            </Row>
            <Row>
                <Col>
                    <p>{data.source.name}</p>
                </Col>
                <Col>
                    <p>{data.author[0]}</p>
                </Col>
            </Row>
        </div>
    </>

}

export default articleCard;