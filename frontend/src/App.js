import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from './Home'
import Results from './Results'
import TextBias from './TextBias'

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/results" element={<Results/>}/>
              <Route path="/textBias" element={<TextBias/>}/>
          </Routes>
      </Router>
  );
}

export default App;
