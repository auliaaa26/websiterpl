import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, X, Bell, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../config/supabase';

import fotoPlaceholder from '../assets/paket.jpg';
import fotoLogo from '../assets/logo.jpeg';

const kategoriList = [
  { label: 'Paket',   id: 'paket'   },
  { label: 'Ayam',    id: 'ayam'    },
  { label: 'Bebek',   id: 'bebek'   },
  { label: 'Ikan',    id: 'ikan'    },
  { label: 'Cemilan', id: 'cemilan' },
  { label: 'Lainnya', id: 'lainnya' },
  { label: 'Minuman', id: 'minuman' },
];

export default function Home() {
  const navigate = useNavigate();
  const { addToCart, totalCount } = useCart();
  const [category, setCategory] = useState('paket');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagihanTempo, setTagihanTempo] = useState([]);

  const [menuData, setMenuData] = useState({
    paket: [], ayam: [], bebek: [], ikan: [], cemilan: [], lainnya: [], minuman: []
  });
  const [mostOrderedData, setMostOrderedData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch menu dari Supabase
  useEffect(() => {
    const fetchMenuFromSupabase = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('menus').select('*');

        if (error) {
          console.error("Gagal mengambil menu:", error.message);
          return;
        }

        if (data) {
          const grouped = {
            paket:   data.filter(m => m.kategori?.toLowerCase() === 'paket'),
            ayam:    data.filter(m => m.kategori?.toLowerCase() === 'ayam'),
            bebek:   data.filter(m => m.kategori?.toLowerCase() === 'bebek'),
            ikan:    data.filter(m => m.kategori?.toLowerCase() === 'ikan'),
            cemilan: data.filter(m => m.kategori?.toLowerCase() === 'cemilan'),
            lainnya: data.filter(m => m.kategori?.toLowerCase() === 'lainnya'),
            minuman: data.filter(m => m.kategori?.toLowerCase() === 'minuman'),
          };
          const favorites = data.filter(m => m.is_most_ordered === true || m.kategori === 'paket').slice(0, 3);
          setMenuData(grouped);
          setMostOrderedData(favorites);
        }
      } catch (err) {
        console.error("Terjadi kesalahan sistem:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuFromSupabase();
  }, []);

  // Fetch tagihan tempo pelanggan yang login
  useEffect(() => {
    const fetchTagihan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: pelanggan } = await supabase
          .from('pelanggan')
          .select('nama')
          .eq('id', user.id)
          .single();

        if (!pelanggan) return;

        const { data } = await supabase
          .from('pembayaran_tempo')
          .select('*')
          .eq('nama_pelanggan', pelanggan.nama)
          .eq('status', 'Belum Lunas')
          .order('jatuh_tempo', { ascending: true });

        setTagihanTempo(data || []);
      } catch (err) {
        console.error("Gagal mengambil tagihan:", err);
      }
    };

    fetchTagihan();
  }, []);

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart({ ...item, foto: item.foto || fotoPlaceholder }, 1);
  };

  const handleAddFromModal = () => {
    if (selectedMenu) {
      addToCart({ ...selectedMenu, foto: selectedMenu.foto || fotoPlaceholder }, 1);
      setSelectedMenu(null);
    }
  };

  const allMenu = Object.values(menuData).flat();
  const isSearching = searchQuery.trim().length > 0;
  const searchResults = isSearching
    ? allMenu.filter(item => item.nama.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const currentMenu = menuData[category] || [];
  const judulSection = kategoriList.find(k => k.id === category)?.label ?? '';

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen text-brand-dark bg-brand-cream font-medium">
        Memuat Menu Lezat...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto pb-24">

      {/* HEADER CREAM */}
      <div className="bg-brand-cream px-4 pt-12 pb-5 rounded-b-3xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img src={fotoLogo} alt="Logo" className="w-10 h-10 rounded-full object-cover border border-brand-orange" />
            <span className="font-bold text-sm text-brand-dark">Warung Kuliner 3 Putri</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="cursor-pointer" onClick={() => navigate('/notification')}>
              <Bell className="w-5 h-5 text-brand-dark" />
            </div>
            <div className="relative cursor-pointer" onClick={() => navigate('/order')}>
              <ShoppingCart className="w-5 h-5 text-brand-dark" />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SEARCHBAR */}
        <div className="flex items-center bg-white border border-orange-200 rounded-full px-4 py-2 shadow-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Mau Makan apa Hari ini?"
            className="bg-transparent flex-1 outline-none text-xs text-brand-dark placeholder-gray-400"
          />
          {isSearching ? (
            <button onClick={() => setSearchQuery('')}><X className="text-gray-400 w-4 h-4 shrink-0" /></button>
          ) : (
            <Search className="text-brand-orange w-4 h-4 shrink-0" />
          )}
        </div>
      </div>

      {/* BANNER TAGIHAN TEMPO */}
      {tagihanTempo.length > 0 && (
        <div className="px-4 mt-3 space-y-2">
          {tagihanTempo.map((t) => {
            const sisaHari = Math.ceil((new Date(t.jatuh_tempo) - new Date()) / (1000 * 60 * 60 * 24));
            const isOverdue = sisaHari < 0;
            const isWarning = sisaHari <= 3 && sisaHari >= 0;

            return (
              <div
                key={t.id}
                className={`rounded-2xl p-3 flex items-start gap-3 ${
                  isOverdue
                    ? 'bg-red-50 border border-red-200'
                    : isWarning
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  isOverdue ? 'text-red-500' : isWarning ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                <div className="flex-1">
                  <p className={`text-xs font-bold ${
                    isOverdue ? 'text-red-700' : isWarning ? 'text-yellow-700' : 'text-blue-700'
                  }`}>
                    {isOverdue
                      ? '⚠️ Tagihan tempo sudah melewati jatuh tempo!'
                      : isWarning
                      ? `⏰ Jatuh tempo ${sisaHari === 0 ? 'hari ini!' : `${sisaHari} hari lagi`}`
                      : '🧾 Kamu punya tagihan tempo aktif'}
                  </p>
                  <p className={`text-xs mt-0.5 ${
                    isOverdue ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-blue-600'
                  }`}>
                    {t.detail_pesanan} —{' '}
                    <span className="font-semibold">
                      Rp {Number(t.total_tagihan).toLocaleString('id-ID')}
                    </span>
                  </p>
                  <p className={`text-xs mt-0.5 ${
                    isOverdue ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-blue-400'
                  }`}>
                    Jatuh tempo:{' '}
                    {new Date(t.jatuh_tempo).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* KONTEN UTAMA */}
      <div className="flex-1 px-4 pt-4">
        {!isSearching && (
          <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-none mt-4">
            {kategoriList.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className={`px-4 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition
                  ${category === id ? 'bg-brand-orange text-white border-brand-orange' : 'border-gray-300 text-brand-dark bg-white'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* MOST ORDERED SECTION */}
        {category === 'paket' && !isSearching && mostOrderedData.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-sm mb-3 text-brand-dark">Most ordered</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {mostOrderedData.map((item) => (
                <div key={item.id} onClick={() => setSelectedMenu(item)}
                  className="min-w-[150px] rounded-2xl overflow-hidden border border-orange-100 cursor-pointer hover:shadow-md transition shrink-0">
                  <img src={item.foto || fotoPlaceholder} className="w-full h-24 object-cover" alt={item.nama} />
                  <div className="p-2 bg-white">
                    <p className="text-xs font-semibold line-clamp-1 text-brand-dark">{item.nama}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GRID DAFTAR MENU */}
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3 text-brand-dark">
            {isSearching ? `Hasil pencarian "${searchQuery}"` : judulSection}
          </h3>

          {(isSearching ? searchResults : currentMenu).length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">Belum ada menu yang tersedia untuk kategori ini.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {(isSearching ? searchResults : currentMenu).map((item) => (
                <div key={item.id}
                  onClick={() => navigate('/detail', { state: { menu: item } })}
                  className="bg-white rounded-2xl p-3 border border-orange-100 text-center cursor-pointer hover:shadow-md transition relative">
                  <img src={item.foto || fotoPlaceholder} className="w-20 h-20 object-cover rounded-full mx-auto mb-2 border-2 border-orange-200" alt={item.nama} />
                  <p className="text-xs font-semibold text-brand-dark leading-tight line-clamp-2 h-8 flex items-center justify-center">{item.nama}</p>
                  <p className="text-xs text-brand-orange mt-1 font-bold">Rp {Number(item.harga).toLocaleString('id-ID')}</p>
                  <button onClick={(e) => handleAddToCart(e, item)}
                    className="absolute bottom-2 right-2 w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center shadow hover:bg-orange-600 transition">
                    <Plus className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL DETAIL SINGKAT */}
      {selectedMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setSelectedMenu(null)}>
          <div className="bg-white w-full max-w-md p-5 rounded-t-3xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <img src={selectedMenu.foto || fotoPlaceholder} alt={selectedMenu.nama} className="w-full h-48 object-cover rounded-2xl mb-4" />
            <h4 className="font-bold text-base text-brand-dark">{selectedMenu.nama}</h4>
            <p className="text-sm text-brand-orange font-bold mt-1 mb-3">Rp {Number(selectedMenu.harga).toLocaleString('id-ID')}</p>
            <p className="text-xs text-gray-500 mb-6">{selectedMenu.deskripsi || 'Tidak ada deskripsi pelengkap.'}</p>
            <button onClick={handleAddFromModal}
              className="w-full bg-brand-orange text-white text-xs font-semibold py-3 rounded-full shadow hover:bg-orange-600 transition">
              Tambah ke Keranjang Belanja
            </button>
          </div>
        </div>
      )}
    </div>
  );
}