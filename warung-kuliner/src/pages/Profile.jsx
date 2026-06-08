import { useState } from 'react';
import { Edit2, Mail, Phone, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="flex-1 bg-brand-cream p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-center font-bold text-lg mb-8 text-brand-dark">Update your profile</h3>
          <div className="space-y-4">
            {['Nama', 'Kelas', 'Kamar', 'No. Telp'].map((field, i) => (
              <div key={i}>
                <label className="text-xs text-gray-500 block mb-1">{field}</label>
                <input type="text" className="w-full bg-white border border-orange-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
              </div>
            ))}
            
            <div className="flex gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input type="radio" name="gender" /> Perempuan
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input type="radio" name="gender" /> Laki-Laki
              </label>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsEditing(false)}
          className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl shadow"
        >
          Save
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white flex flex-col">
      <Navbar />
      
      <div className="p-6 flex-1 bg-brand-cream flex flex-col justify-between rounded-t-[30px] mt-4 shadow-inner">
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 mb-4">Your Profile</p>
          
          {/* Avatar Area */}
          <div className="relative w-28 h-28 mx-auto mb-3">
            {/* SPACE FOTO PROFIL */}
            <img src="https://via.placeholder.com/120" className="w-full h-full object-cover rounded-full border-4 border-white shadow-md" alt="Avatar" />
            <button onClick={() => setIsEditing(true)} className="absolute bottom-1 right-1 bg-brand-orange text-white p-1.5 rounded-full shadow">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <h3 className="font-bold text-base">Siti Alyana cantik</h3>
          <p className="text-xs text-gray-500">XXI Ips - Kamar BB 2</p>

          {/* Info Details */}
          <div className="mt-6 space-y-3 text-left">
            <div className="flex items-center bg-white border border-orange-100 rounded-xl px-4 py-3 text-xs">
              <Mail className="w-4 h-4 text-brand-orange mr-3" />
              <span className="text-gray-600">SitiAlyanaCantikdepok@gmail.com</span>
            </div>
            <div className="flex items-center bg-white border border-orange-100 rounded-xl px-4 py-3 text-xs">
              <Phone className="w-4 h-4 text-brand-orange mr-3" />
              <span className="text-gray-600">0809837252282</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-orange-600 transition"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </div>
  );
}