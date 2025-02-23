import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Chart from "chart.js/auto";

function Results() {

    const location = useLocation()
    const { data } = location.state || {};

    return (<Container>
        <div className="fullscreen-section">Hi </div>

    </Container>)
}


export default Results;