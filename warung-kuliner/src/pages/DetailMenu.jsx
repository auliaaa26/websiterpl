import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function DetailMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const menu = location.state?.menu;
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);

  if (!menu) {
    navigate('/home');
    return null;
  }

  const hargaAngka = menu.hargaNum ?? (typeof menu.harga === 'string' ? parseInt(menu.harga.replace(/\D/g, '')) : menu.harga);
  const total = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(hargaAngka * qty);

  const handleTambah = () => {
    addToCart(menu, qty); // ← simpan ke context
    navigate('/order');
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-cream">

      {/* AREA CREAM HEADER */}
      <div className="px-4 pt-5 pb-6 relative">

        {/* Tombol back & like */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-brand-dark" />
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm"
          >
            <Heart
              className="w-4 h-4 transition"
              fill={liked ? '#E87717' : 'none'}
              stroke={liked ? '#E87717' : '#9ca3af'}
            />
          </button>
        </div>

        {/* Nama warung & label */}
        <div className="text-center mb-5">
          <h2 className="font-bold text-lg text-brand-dark">Warung Kuliner 3 Putri</h2>
          <p className="text-xs text-brand-orange font-medium mt-0.5">Menu</p>
        </div>

        {/* Card foto */}
        <div className="bg-brand-cream rounded-3xl p-4 shadow-sm border border-orange-100">
          <img
            src={menu.foto}
            alt={menu.nama}
            className="w-full h-52 object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* AREA PUTIH BAWAH */}
      <div className="flex-1 bg-white rounded-t-3xl px-5 pt-5 pb-6 flex flex-col justify-between">

        <div>
          {/* Nama & like */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-bold text-lg text-brand-dark leading-tight">{menu.nama}</h1>
              <p className="text-brand-dark font-semibold text-sm mt-0.5">
                {`Rp ${Number(menu.harga).toLocaleString('id-ID')}`}
              </p>
            </div>
            <button onClick={() => setLiked(!liked)} className="mt-1">
              <Heart
                className="w-4 h-4 transition"
                fill={liked ? '#E87717' : 'none'}
                stroke={liked ? '#E87717' : '#d1d5db'}
              />
            </button>
          </div>

          {/* Deskripsi */}
          <p className="text-xs text-gray-500 leading-relaxed mt-3">{menu.deskripsi}</p>
        </div>

        {/* QTY + TOMBOL */}
        <div className="mt-6">
          {/* Quantity */}
          <div className="flex items-center gap-5 mb-5">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
            >
              <Minus className="w-4 h-4 text-brand-dark" />
            </button>
            <span className="text-base font-semibold text-brand-dark">{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
            >
              <Plus className="w-4 h-4 text-brand-dark" />
            </button>
          </div>

          {/* Total harga preview */}
          <p className="text-center text-xs text-gray-400 mb-3">Total: <span className="font-semibold text-brand-dark">{total}</span></p>

          {/* Tombol Tambah */}
          <button
            onClick={handleTambah}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-full shadow-lg transition"
          >
            Tambah
          </button>
        </div>

      </div>
    </div>
  );
}