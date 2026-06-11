import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';

function getStatusConfig(status) {
  switch (status) {
    case 'pending':
      return { label: 'Menunggu', icon: '🕐', desc: 'Pesananmu sedang menunggu konfirmasi admin.', borderColor: '#FDE68A', bgColor: '#FFFBEB', textColor: '#D97706' };
    case 'menunggu_konfirmasi':
      return { label: 'Verifikasi Bayar', icon: '🔍', desc: 'Bukti pembayaranmu sedang diverifikasi oleh admin.', borderColor: '#BFDBFE', bgColor: '#EFF6FF', textColor: '#1D4ED8' };
    case 'diterima':
      return { label: 'Diterima', icon: '✅', desc: 'Pesananmu sudah dikonfirmasi dan akan segera diproses.', borderColor: '#6EE7B7', bgColor: '#ECFDF5', textColor: '#059669' };
    case 'diproses':
      return { label: 'Sedang Diproses', icon: '👨‍🍳', desc: 'Pesananmu sedang disiapkan oleh dapur.', borderColor: '#C7D2FE', bgColor: '#EEF2FF', textColor: '#4338CA' };
    case 'dikirim':
      return { label: 'Dikirim', icon: '🚀', desc: 'Pesananmu sudah dalam perjalanan ke kamarmu!', borderColor: '#86EFAC', bgColor: '#F0FDF4', textColor: '#15803D' };
    case 'dibatalkan':
      return { label: 'Dibatalkan', icon: '❌', desc: 'Pesananmu dibatalkan. Hubungi admin untuk info lebih lanjut.', borderColor: '#FECACA', bgColor: '#FEF2F2', textColor: '#DC2626' };
    case 'tempo':
      return { label: 'Tempo', icon: '📋', desc: 'Kamu memilih pembayaran tempo. Segera lunasi sebelum jatuh tempo!', borderColor: '#DDD6FE', bgColor: '#FAF5FF', textColor: '#7C3AED' };
    default:
      return { label: status, icon: '📦', desc: '', borderColor: '#E5E7EB', bgColor: '#F9FAFB', textColor: '#6B7280' };
  }
}

const formatTanggal = (iso) => {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  );
};

export default function Notification() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyOrders();

    const channel = supabase
      .channel('pesanan_realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'pesanan_masuk' }, () => {
        fetchMyOrders();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: pelanggan } = await supabase
        .from('pelanggan')
        .select('nama, kamar')
        .eq('id', user?.id)
        .single();

      if (!pelanggan) return;

      const { data, error } = await supabase
        .from('pesanan_masuk')
        .select('*')
        .eq('nama_pelanggan', pelanggan.nama)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Gagal mengambil notifikasi:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Klik "Bayar Sekarang" → lari ke /payment dengan data tagihan via state
  const handleBayarTempo = (order) => {
    navigate('/payment', {
      state: {
        fromTempo: true,
        id_pesanan: order.id_pesanan,
        total_harga: order.total_harga,
        detail_pesanan: order.detail_pesanan,
      }
    });
  };

  return (
    <div className="flex-1 bg-white">
      <Navbar />
      <div className="p-4">
        <h3 className="font-bold text-sm text-gray-500 mb-4">Notification</h3>

        <div className="space-y-3">
          <p className="text-xs font-bold text-brand-dark mb-2">Status Pesananmu</p>

          {loading ? (
            <p className="text-xs text-gray-400 text-center py-6">Memuat notifikasi...</p>
          ) : orders.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">Belum ada pesanan.</p>
          ) : orders.map((order) => {
            const cfg = getStatusConfig(order.status);
            return (
              <div
                key={order.id_pesanan}
                style={{
                  background: cfg.bgColor,
                  border: '1px solid ' + cfg.borderColor,
                  borderRadius: 12,
                  padding: 16,
                  position: 'relative',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{cfg.icon}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 12, color: '#111827', margin: 0 }}>{order.nama_pelanggan}</p>
                      <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>Kamar {order.kamar}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                    color: cfg.textColor, background: 'white', border: '1px solid ' + cfg.borderColor,
                    whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    {cfg.label}
                  </span>
                </div>

                <div style={{ marginTop: 10, fontSize: 12 }}>
                  <p style={{ fontWeight: 600, color: '#111827', margin: 0 }}>{order.detail_pesanan}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>
                    Rp {Number(order.total_harga).toLocaleString('id-ID')}
                  </p>
                </div>

                {cfg.desc ? (
                  <p style={{ marginTop: 8, fontSize: 11, fontWeight: 500, color: cfg.textColor }}>
                    {cfg.desc}
                  </p>
                ) : null}

                {/* Tombol Bayar — hanya muncul kalau status tempo */}
                {order.status === 'tempo' && (
                  <button
                    onClick={() => handleBayarTempo(order)}
                    style={{
                      marginTop: 12,
                      width: '100%',
                      background: '#7C3AED',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 0',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    💳 Bayar Sekarang — Rp {Number(order.total_harga).toLocaleString('id-ID')}
                  </button>
                )}

                <p style={{ marginTop: 8, fontSize: 10, color: '#D1D5DB' }}>
                  {formatTanggal(order.created_at)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}