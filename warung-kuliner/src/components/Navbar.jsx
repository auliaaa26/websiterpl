import { Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import fotoLogo from '../assets/logo.jpeg';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="p-4 bg-brand-cream flex items-center justify-between border-b border-orange-100">
      <div className="cursor-pointer flex items-center gap-2" onClick={() => navigate('/home')}>
        <img src={fotoLogo} alt="Logo Warung" className="w-10 h-10 rounded-full border border-brand-orange object-cover" />
        <h1 className="font-bold text-lg text-brand-dark">Warung Kuliner 3 Putri</h1>
      </div>
      <div className="flex items-center gap-3">
        <Bell className="w-6 h-6 text-brand-orange cursor-pointer" onClick={() => navigate('/notification')} />
        <User className="w-6 h-6 text-brand-orange cursor-pointer" onClick={() => navigate('/profile')} />
      </div>
    </div>
  );
}