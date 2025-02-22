import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";

function Results() {
    const [data, setData] = useState(null);

    useEffect(() => { fetch("https://newsapi.org/v2/everything?q=apple&from=2025-02-21&to=2025-02-21&sortBy=popularity&apiKey=281e38068b43403e9b7869cfca993a41", {
        mode: "cors"
    })
        .then(response => response.json()) 
        .then(data => setData(data)) 
        .catch(error => console.error("Error fetching data:", error));
    }, []);
        
    console.log(data);

    return (<Container>

    </Container>)
}


export default Results;