import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
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
      <div className="app-shell">
        {/* Sidebar hanya tampil di desktop */}
        <aside className="app-sidebar">
          <div className="sidebar-brand">
            <span className="sidebar-logo">🍽️</span>
            <div>
              <p className="sidebar-title">Warung Kuliner</p>
              <p className="sidebar-sub">3 Putri</p>
            </div>
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/home"         className={({ isActive }) => 'sidebar-link' + (isActive ? ' sidebar-link--active' : '')}>🏠 Beranda</NavLink>
            <NavLink to="/order"        className={({ isActive }) => 'sidebar-link' + (isActive ? ' sidebar-link--active' : '')}>🛒 Pesanan</NavLink>
            <NavLink to="/notification" className={({ isActive }) => 'sidebar-link' + (isActive ? ' sidebar-link--active' : '')}>🔔 Notifikasi</NavLink>
            <NavLink to="/profile"      className={({ isActive }) => 'sidebar-link' + (isActive ? ' sidebar-link--active' : '')}>👤 Profil</NavLink>
          </nav>
          <p className="sidebar-footer">© 2025 Warung Kuliner 3 Putri</p>
        </aside>

        {/* Konten utama */}
        <main className="app-main">
          <div className="app-card">
            <Routes>
              <Route path="/"            element={<Login />} />
              <Route path="/register"    element={<Register />} />
              <Route path="/home"        element={<Home />} />
              <Route path="/detail"      element={<DetailMenu />} />
              <Route path="/order"       element={<OrderSummary />} />
              <Route path="/payment"     element={<Payment />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/profile"     element={<Profile />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;