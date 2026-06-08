import { ClipboardList, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function OrderSummary() {
  const navigate = useNavigate();
  const { cartItems, updateQty, updateNotes, totalHarga } = useCart();

  const totalFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(totalHarga);

  return (
    <div className="flex-1 bg-brand-cream p-4 flex flex-col justify-between">
      <div>
        {/* Judul Atas */}
        <div className="flex items-center gap-2 mb-6 text-brand-dark">
          <ClipboardList className="w-6 h-6 text-brand-orange" />
          <h2 className="text-lg font-bold">Your Order</h2>
        </div>

        {/* List item dari cart */}
        <div className="space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">Belum ada item di keranjang</p>
              <button
                onClick={() => navigate('/home')}
                className="mt-3 text-brand-orange text-xs font-semibold underline"
              >
                Pilih menu dulu
              </button>
            </div>
          ) : (
            cartItems.map(item => {
              const harga = item.hargaNum ?? (typeof item.harga === 'string' ? parseInt(item.harga.replace(/\D/g, '')) : Number(item.harga));
              const hargaFormatted = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(harga);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 flex items-center gap-4"
                >
                  <img
                    src={item.foto}
                    className="w-16 h-16 rounded-full object-cover border border-orange-100 shrink-0"
                    alt={item.nama}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-brand-dark truncate">{item.nama}</h4>
                    <p className="text-xs text-brand-orange font-semibold mt-0.5">{hargaFormatted}</p>
                    <input
                      type="text"
                      placeholder="Notes :"
                      value={item.notes}
                      onChange={e => updateNotes(item.id, e.target.value)}
                      className="w-full border-b border-gray-200 text-[11px] outline-none mt-2 pb-1 bg-transparent placeholder-gray-400"
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-full border shrink-0">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="p-1"
                    >
                      <Minus className="w-3 h-3 text-gray-400" />
                    </button>
                    <span className="text-xs font-bold px-1">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, +1)}
                      className="p-1"
                    >
                      <Plus className="w-3 h-3 text-brand-orange" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Payment Actions */}
      {cartItems.length > 0 && (
        <div className="space-y-4 mt-6">
          <div className="flex justify-between items-center px-2">
            <span className="font-bold text-sm text-gray-600">Total</span>
            <span className="font-bold text-lg text-brand-dark">{totalFormatted}</span>
          </div>
          <button
            onClick={() => navigate('/payment')}
            className="w-full bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-emerald-600 transition"
          >
            Pesan
          </button>
        </div>
      )}
    </div>
  );
}