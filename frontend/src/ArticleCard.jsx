import "./ArticleCard.css";
import { useState } from 'react';
import { Container, Row, Col, Button, Card, Image } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * 
 * @param {*} data includes whatever is given by then
 */
function articleCard(data){
    var publishedDate;
    if(data.props.publishedAt){
        publishedDate = new Date(data.props.publishedAt);
    } else {
        publishedDate = new Date(data.props.published_date);
    }
    
    //const formattedDate = publishedDate.toISOString().split("T")[0];
    //console.log(formattedDate);
    console.log(data)

    return  <Card>            
                <div className="card_all_text">
                <Row>
                    <p className="card_title">{data.props.title}</p>
                </Row>
                <Row className="justify-content-center">
                   {data.props.description && <p className="card_description">{data.props.description}</p>}
                </Row>
                   <Row className="card_bottom_content">
                        {data.props.source && <Col>
                            <a className="source_name" href={data.props.url} target="_blank">
                                <Button>
                                    {data.props.source.name}
                                </Button>
                            </a>     
                        </Col>}
                        {data.props.author && <Col>
                            <p className="author">{data.props.author}</p>
                        </Col>}
                        {data.props.authors && <Col>
                            <p className="author">{data.props.authors[0]}</p>
                        </Col>}
                        <Col>
                            <p className="card_date">{publishedDate.toISOString().split("T")[0]}</p>
                        </Col>
                    
                    
                
                {data.props.urlToImage && <Col xs={4}>
                    <Image className="card_photo" src={data.props.urlToImage}></Image>
                </Col>}
                </Row>
                </div>
    </Card>

}

export default articleCard;