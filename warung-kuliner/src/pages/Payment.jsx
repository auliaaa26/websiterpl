import { DollarSign, Upload, X, CheckCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

const QRIS_URL = 'https://nwyabqqadefzkalsftku.supabase.co/storage/v1/object/public/assets/QRIS%20PEMBAYARAN%20.jpeg';

export default function Payment() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [buktiBayar, setBuktiBayar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const { cartItems, totalHarga, clearCart } = useCart();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setUploadError('Ukuran file maksimal 5MB'); return; }
    if (!file.type.startsWith('image/')) { setUploadError('File harus berupa gambar'); return; }
    setUploadError('');
    setBuktiBayar(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadBuktiBayar = async () => {
    if (!buktiBayar) return null;
    const { data: { user } } = await supabase.auth.getUser();
    const ext = buktiBayar.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('bukti-bayar')
      .upload(fileName, buktiBayar, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('bukti-bayar').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const submitPesanan = async (tipePayment) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: pelanggan } = await supabase
        .from('pelanggan')
        .select('nama, kamar')
        .eq('id', user?.id)
        .single();

      const detail_pesanan = cartItems.map(item => item.nama).join(', ');
      const jumlah = cartItems.reduce((sum, item) => sum + item.qty, 0);

      let buktiBayarUrl = null;
      if (tipePayment === 'langsung') {
        buktiBayarUrl = await uploadBuktiBayar();
      }

      // Insert ke pesanan_masuk
      const { data: pesanan, error } = await supabase
        .from('pesanan_masuk')
        .insert([{
          nama_pelanggan: pelanggan?.nama || 'Pelanggan',
          kamar: pelanggan?.kamar || '-',
          detail_pesanan,
          jumlah,
          total_harga: totalHarga,
          status: tipePayment === 'langsung' ? 'menunggu_konfirmasi' : 'tempo',
          tipe_pembayaran: tipePayment,
          bukti_bayar: buktiBayarUrl,
        }])
        .select()
        .single();

      if (error) throw error;

      // Jika tempo, otomatis buat tagihan di pembayaran_tempo
      if (tipePayment === 'tempo') {
        const jatuhTempo = new Date();
        jatuhTempo.setDate(jatuhTempo.getDate() + 14);

        const { error: tempoError } = await supabase
          .from('pembayaran_tempo')
          .insert([{
            id_pesanan: pesanan.id_pesanan,
            nama_pelanggan: pelanggan?.nama || 'Pelanggan',
            kamar: pelanggan?.kamar || '-',
            detail_pesanan,
            total_tagihan: totalHarga,
            jatuh_tempo: jatuhTempo.toISOString(),
            status: 'Belum Lunas',
          }]);

        if (tempoError) throw tempoError;
      }

      clearCart?.();
      setShowUploadModal(false);
      setIsSuccess(true);
    } catch (err) {
      alert('Gagal menyimpan pesanan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = () => {
    if (!buktiBayar) {
      setShowUploadModal(true);
    } else {
      submitPesanan('langsung');
    }
  };

  if (isSuccess) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">✓</div>
        </div>
        <h3 className="text-lg font-bold text-gray-800">Pesanan Diterima!</h3>
        <p className="text-sm text-gray-500 mt-2">
          {buktiBayar ? 'Menunggu konfirmasi pembayaran dari admin' : 'Pesanan tempo kamu sudah tercatat, jatuh tempo 14 hari'}
        </p>
        <button onClick={() => navigate('/home')} className="mt-6 text-brand-orange text-sm font-semibold underline">
          Kembali ke Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-brand-cream p-4 flex flex-col justify-between min-h-screen">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-6 h-6 text-brand-orange" />
          <h2 className="text-lg font-bold">Payment</h2>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-orange-100 text-center max-w-[300px] mx-auto">
          <p className="text-xs font-semibold text-gray-500 mb-1">Scan QRIS untuk Membayar</p>
          <p className="text-xs text-gray-400 mb-3">warung kuliner3putri</p>
          <img src={QRIS_URL} alt="QRIS Payment" className="w-full object-contain rounded-xl" />
          <p className="text-lg font-bold text-brand-dark mt-3">
            Rp {totalHarga.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-gray-400 mt-1">*Masukkan nominal sesuai total di atas</p>
        </div>

        {buktiBayar && (
          <div className="mt-4 mx-auto max-w-[300px] bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-emerald-700">Bukti bayar siap diupload</p>
              <p className="text-xs text-emerald-600 truncate">{buktiBayar.name}</p>
            </div>
            <button onClick={() => { setBuktiBayar(null); setPreviewUrl(null); }}>
              <X className="w-4 h-4 text-emerald-400 hover:text-red-400" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2.5 mt-6">
        <button onClick={handleMarkAsPaid} disabled={loading}
          className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-emerald-600 transition disabled:opacity-50">
          {loading ? 'Memproses...' : buktiBayar ? '✓ Konfirmasi Pembayaran' : 'Mark As Paid'}
        </button>
        <button onClick={() => submitPesanan('tempo')} disabled={loading}
          className="w-full bg-red-500 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-red-600 transition disabled:opacity-50">
          {loading ? 'Memproses...' : 'Postpaid Payment'}
        </button>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">Upload Bukti Pembayaran</h3>
              <button onClick={() => setShowUploadModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Upload screenshot bukti transfer QRIS kamu sebelum konfirmasi pesanan</p>

            {previewUrl ? (
              <div className="relative mb-4">
                <img src={previewUrl} alt="Preview" className="w-full h-52 object-cover rounded-xl border border-gray-200" />
                <button onClick={() => { setBuktiBayar(null); setPreviewUrl(null); }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 mb-4 hover:border-emerald-400 transition">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500">Tap untuk pilih foto</span>
                <span className="text-xs text-gray-400">JPG, PNG — maks 5MB</span>
              </button>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {uploadError && <p className="text-red-500 text-xs mb-3">{uploadError}</p>}

            <button
              onClick={() => {
                if (!buktiBayar) { setUploadError('Pilih foto bukti pembayaran dulu'); return; }
                setShowUploadModal(false);
                submitPesanan('langsung');
              }}
              disabled={!buktiBayar || loading}
              className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 transition">
              {loading ? 'Mengupload & Menyimpan...' : 'Kirim Bukti Pembayaran'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}