import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/Login"
import Home from "./components/Home"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Login}/>
        <Route path="/home" Component={Home}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
