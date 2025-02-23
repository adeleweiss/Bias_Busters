import logo from './logo.svg';
import './App.css';
import {useState} from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from './Home'
import Results from './Results'
import TextBias from './TextBias'
import ArticleContext from './ArticleContext';

function App() {
    const [prefs, setPrefs] = useState({});
  return (
    <ArticleContext.Provider value={[prefs, setPrefs]}>
      <Router>
           <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/results" element={<Results/>}/>
              <Route path="/textBias" element={<TextBias/>}/>
          </Routes>
          
      </Router>
      </ArticleContext.Provider>  
  );
}

export default App;
