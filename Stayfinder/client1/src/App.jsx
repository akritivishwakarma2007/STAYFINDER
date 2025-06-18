// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { BrowserRouter } from "react-router-dom";

<BrowserRouter
  future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
>
  <App />
</BrowserRouter>


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;