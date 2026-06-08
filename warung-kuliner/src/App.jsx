import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import DetailMenu from './pages/DetailMenu';
import OrderSummary from './pages/OrderSummary';
import Payment from './pages/Payment';
import Notification from './pages/Notification';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      {/* Container dibuat maksimal selebar mobile (seperti mockup di video) */}
      <div className="max-w-md mx-auto min-h-screen bg-brand-orange shadow-2xl relative flex flex-col overflow-x-hidden overflow-hidden" style={{ contain: 'layout' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/detail" element={<DetailMenu />} />
          <Route path="/order" element={<OrderSummary />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;