import "./article_card.css";
import { useState } from 'react';
import { Container, Row, Col, Button, Card, Image } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * 
 * @param {*} data includes whatever is given by then
 */
function articleCard(data){
    const publishedDate = new Date(data.props.publishedAt);
    //const formattedDate = publishedDate.toISOString().split("T")[0];
    //console.log(formattedDate);
    console.log(data)
    if(data.props.urlToImage == undefined){
        return;
    }

    return  <Card>
        <div>
            <Row>
                <Col xs={8} className="card_all_text">
                    <p className="card_title">{data.props.title}</p>
                    <p className="card_description">{data.props.description}</p>
                    <Row className="card_bottom_content">
                        <Col>
                            <a className="source_name" href={data.props.url} target="_blank">
                                <Button>
                                    {data.props.source.name}
                                </Button>
                            </a>     
                        </Col>
                        <Col>
                            <p className="author">{data.props.author}</p>
                        </Col>
                        <Col>
                            <p className="card_date">{publishedDate.toISOString().split("T")[0]}</p>
                        </Col>
                    </Row>
                </Col>
                <Col xs={4}>
                    <Image className="card_photo" src={data.props.urlToImage}></Image>
                </Col>
                
            </Row>
            
        </div>
    </Card>

}

export default articleCard;