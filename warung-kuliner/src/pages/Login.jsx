import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../config/supabase'; // 👈 Pastikan import database Supabase kamu

export default function Login() {
  const navigate = useNavigate();
  
  // 👈 State untuk menangkap data input form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 👈 Fungsi Autentikasi Login Nyata ke Supabase
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Email dan Password wajib diisi.',
        icon: 'warning',
        confirmButtonColor: '#E87717',
      });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      // Jika password salah atau email belum didaftarkan oleh admin
      Swal.fire({
        title: 'Gagal Masuk',
        text: 'Email atau Password salah. Harap hubungi Admin jika Anda belum memiliki akun.',
        icon: 'error',
        confirmButtonColor: '#E87717',
      });
    } else {
      // Jika berhasil login
      Swal.fire({
        title: 'Berhasil Masuk!',
        text: 'Selamat datang kembali di Warung Kuliner 3 Putri!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      
      // Lempar pelanggan masuk ke dashboard utama menu
      navigate('/home');
    }
  };


  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen">
      {/* Header Oranye Melengkung Ke Bawah */}
      <div className="bg-brand-orange text-white pt-16 pb-20 px-8 rounded-b-[50px] relative shadow-md text-left">
        <p className="text-lg opacity-90">Hello, Welcome Back!</p>
        <h2 className="text-4xl font-bold mt-1 text-white">Sign In</h2>
      </div>

      {/* Form Input */}
      {/* Diubah menggunakan tag <form> agar event submit bekerja dengan menekan enter */}
      <form onSubmit={handleSignIn} className="flex-1 px-6 pt-12 flex flex-col justify-between pb-8">
        <div className="space-y-5">
          <div>
            <label className="text-sm text-gray-500 block mb-1 text-left">Email Akun</label>
            <div className="flex items-center bg-orange-50 border border-orange-200 rounded-full px-4 py-3">
              <User className="text-brand-orange w-5 h-5 mr-3" />
              <input 
                type="email" 
                placeholder="Masukkan email yang didaftarkan admin" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent flex-1 outline-none text-sm text-brand-dark focus:ring-0" 
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-1 text-left">Password</label>
            <div className="flex items-center bg-orange-50 border border-orange-200 rounded-full px-4 py-3">
              <Lock className="text-brand-orange w-5 h-5 mr-3" />
              <input 
                type="password" 
                placeholder="Masukkan password Anda" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent flex-1 outline-none text-sm text-brand-dark focus:ring-0" 
                required
              />
            </div>
            <p className="text-right text-xs text-gray-500 mt-2 cursor-pointer hover:text-brand-orange transition">Forgot Password?</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-signin-orange font-semibold py-3 rounded-full shadow-lg mt-4 transition duration-200 text-white bg-brand-orange hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Memverifikasi...' : 'Sign In'}
          </button>
        </div>

        {/* Footer OAuth & Informasi Akun */}
        <div className="text-center space-y-4 mt-8">
          <a
            href="https://wa.me/628888385316?text=Halo%20Admin%2C%20saya%20ingin%20mendaftar%20akun%20di%20Warung%20Kuliner%203%20Putri."
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-brand-orange hover:underline transition"
          >
            Belum punya akun? <span className="font-semibold text-brand-orange">Hubungi Admin</span>
          </a>
        </div>
      </form>
    </div>
  );
}