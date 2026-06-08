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

  const handleGoogleLogin = () => {
    Swal.fire({
      title: 'Rekomendasi Masuk',
      text: 'Disarankan untuk masuk menggunakan akun Google utama Anda demi keamanan data.',
      icon: 'info',
      confirmButtonText: 'Lanjutkan dengan Google',
      confirmButtonColor: '#E87717',
      showCancelButton: true,
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Fitur Google Sign-In sedang disiapkan.',
          icon: 'success',
          confirmButtonColor: '#E87717',
        });
      }
    });
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
          <div className="flex items-center my-4 text-gray-400 text-xs">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="px-3">Or</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>
          
          <p 
            onClick={() => {
              Swal.fire({
                title: 'Informasi Pendaftaran',
                text: 'Untuk mendapatkan akun, silakan hubungi Kasir / Admin utama warung untuk mendaftarkan nomor kamar Anda.',
                icon: 'info',
                confirmButtonColor: '#E87717'
              });
            }} 
            className="text-xs text-gray-500 cursor-pointer hover:text-brand-orange hover:underline transition"
          >
            Haven't any account? <span className="font-semibold text-brand-orange">Hubungi Admin</span>
          </p>
          
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="mx-auto w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.273 0 3.191 2.69 1.145 6.655l4.12 3.11z" />
              <path fill="#34A853" d="M16.04 15.345c-1.073.736-2.428 1.164-4.04 1.164-2.955 0-5.464-2-6.355-4.691L1.464 14.91C3.59 19.19 8.355 22 12 22c3.055 0 5.891-1 8.036-2.855l-4-3.8z" />
              <path fill="#4285F4" d="M23.491 12.273c0-.818-.082-1.609-.218-2.364H12v4.51h6.473c-.29 1.482-1.127 2.727-2.391 3.564l4 3.8c2.336-2.154 3.418-5.327 3.418-9.51z" />
              <path fill="#FBBC05" d="M5.645 13.818A6.974 6.974 0 015.31 12c0-.627.1-1.236.273-1.818L1.464 7.073A11.906 11.906 0 000 12c0 1.764.382 3.436 1.064 4.955l4.581-3.137z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}