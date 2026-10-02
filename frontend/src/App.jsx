import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import StoryLoader from "./components/StoryLoader.jsx"
import {useState} from 'react';
import StoryGenerator from "./components/StoryGenerator.jsx"

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Interactive Story Generator</h1>
        </header>
        <main>  {/*<main> is an HTML semantic element used to mark the main content of a webpage.*/}
          <Routes>
            <Route path={"/story/:id"} element={<StoryLoader />} />  {/* :id means dynamic value*/}
            <Route path={"/"} element={<StoryGenerator />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
