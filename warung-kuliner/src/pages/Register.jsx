import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Register() {
  const navigate = useNavigate();

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // Notifikasi sukses setelah berhasil daftar
    Swal.fire({
      title: 'Registrasi Berhasil!',
      text: 'Akun Anda telah terdaftar. Silakan masuk.',
      icon: 'success',
      confirmButtonColor: '#E87717',
    }).then(() => {
      navigate('/'); // Kembali ke halaman login setelah klik OK
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-orange min-height-100svh justify-between">
      {/* Header Atas Tema Oranye */}
      <div className="text-white pt-16 pb-10 px-8 text-left">
        <p className="text-lg opacity-90">Hello, Join Us!</p>
        <h2 className="text-4xl font-bold mt-1 text-white">Sign Up</h2>
      </div>

      {/* Form Input Dengan Lengkungan Putih Ke Atas (Sesuai Gambar) */}
      <div className="bg-white rounded-t-[50px] flex-1 px-6 pt-12 flex flex-col justify-between pb-8 shadow-2xl">
        <form onSubmit={handleRegisterSubmit} className="space-y-5">
          {/* Input Full Name / Username */}
          <div>
            <label className="text-sm text-gray-500 block mb-1 text-left">Username</label>
            <div className="flex items-center bg-orange-50 border border-orange-200 rounded-full px-4 py-3">
              <User className="text-brand-orange w-5 h-5 mr-3" />
              <input 
                type="text" 
                required
                placeholder="Masukkan username baru" 
                className="bg-transparent flex-1 outline-none text-sm text-brand-dark focus:ring-0" 
              />
            </div>
          </div>

          {/* Input Email */}
          <div>
            <label className="text-sm text-gray-500 block mb-1 text-left">Email</label>
            <div className="flex items-center bg-orange-50 border border-orange-200 rounded-full px-4 py-3">
              <Mail className="text-brand-orange w-5 h-5 mr-3" />
              <input 
                type="email" 
                required
                placeholder="Masukkan email aktif" 
                className="bg-transparent flex-1 outline-none text-sm text-brand-dark focus:ring-0" 
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="text-sm text-gray-500 block mb-1 text-left">Password</label>
            <div className="flex items-center bg-orange-50 border border-orange-200 rounded-full px-4 py-3">
              <Lock className="text-brand-orange w-5 h-5 mr-3" />
              <input 
                type="password" 
                required
                placeholder="Masukkan password baru" 
                className="bg-transparent flex-1 outline-none text-sm text-brand-dark focus:ring-0" 
              />
            </div>
          </div>

          {/* Tombol Sign Up Oranye */}
          <button 
            type="submit"
            className="w-full btn-signin-orange font-semibold py-3 rounded-full shadow-lg mt-6 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Footer Link Kembali Ke Login */}
        <div className="text-center mt-8">
          <p 
            onClick={() => navigate('/')} 
            className="text-xs text-gray-500 cursor-pointer hover:text-brand-orange hover:underline transition"
          >
            Already have an account? <span className="font-semibold text-brand-orange">Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
}