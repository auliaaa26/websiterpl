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
      {/*
        Responsive container:
        - Mobile  (<640px)  : full width, no shadow  → tampilan asli seperti semula
        - Tablet  (640–1023px): max-w-lg centered, with shadow card
        - Desktop (≥1024px) : two-column layout — sidebar kiri + konten kanan
      */}
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
            <a href="/home"         className="sidebar-link">🏠 Beranda</a>
            <a href="/order"        className="sidebar-link">🛒 Pesanan</a>
            <a href="/notification" className="sidebar-link">🔔 Notifikasi</a>
            <a href="/profile"      className="sidebar-link">👤 Profil</a>
          </nav>
          <p className="sidebar-footer">© 2025 Warung Kuliner 3 Putri</p>
        </aside>

        {/* Konten utama — selalu ada di semua ukuran */}
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