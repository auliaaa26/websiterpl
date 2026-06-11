import { useState, useEffect, useRef } from 'react';
import { Edit2, Mail, Phone, LogOut, User, Camera } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nama: '',
    kamar: '',
    no_tlpn: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate('/'); return; }

        const { data, error } = await supabase
          .from('pelanggan')
          .select('*')
          .eq('email', user.email)
          .single();

        if (error) throw error;

        setProfile(data);
        setFormData({
          nama: data.nama || '',
          kamar: data.kamar || '',
          no_tlpn: data.no_tlpn || '',
        });

        if (data.avatar_url) {
          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(data.avatar_url);
          setAvatarUrl(urlData.publicUrl);
        }
      } catch (err) {
        console.error('Error fetching profile:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format foto harus JPG, PNG, atau WebP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto maksimal 2MB.');
      return;
    }

    setUploadingPhoto(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('pelanggan')
        .update({ avatar_url: filePath })
        .eq('email', user.email);

      if (updateError) throw updateError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      setAvatarUrl(urlData.publicUrl + '?t=' + Date.now());
      setProfile(prev => ({ ...prev, avatar_url: filePath }));

    } catch (err) {
      console.error('Error uploading photo:', err.message);
      alert('Gagal upload foto. Coba lagi.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('pelanggan')
        .update({
          nama: formData.nama,
          kamar: formData.kamar,
          no_tlpn: formData.no_tlpn,
        })
        .eq('email', user.email);

      if (error) throw error;

      setProfile(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err.message);
      alert('Gagal menyimpan perubahan. Coba lagi.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex-1 bg-brand-cream flex items-center justify-center">
        <p className="text-sm text-gray-400">Memuat profil...</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="flex-1 bg-brand-cream p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-center font-bold text-lg mb-8 text-brand-dark">Update your profile</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Nama</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                className="w-full bg-white border border-orange-200 rounded-xl px-4 py-2.5 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Kamar</label>
              <input
                type="text"
                value={formData.kamar}
                onChange={(e) => setFormData(prev => ({ ...prev, kamar: e.target.value }))}
                className="w-full bg-white border border-orange-200 rounded-xl px-4 py-2.5 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">No. Telp</label>
              <input
                type="text"
                value={formData.no_tlpn}
                onChange={(e) => setFormData(prev => ({ ...prev, no_tlpn: e.target.value }))}
                className="w-full bg-white border border-orange-200 rounded-xl px-4 py-2.5 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setIsEditing(false)}
            className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl shadow"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl shadow"
          >
            Simpan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white flex flex-col">
      <Navbar />

      <div className="p-6 flex-1 bg-brand-cream flex flex-col justify-between rounded-t-[30px] mt-4 shadow-inner">
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 mb-4">Your Profile</p>

          {/* Avatar — hanya tombol kamera di pojok kanan bawah */}
          <div className="relative w-28 h-28 mx-auto mb-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Foto Profil"
                className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-full h-full rounded-full border-4 border-white shadow-md bg-orange-100 flex items-center justify-center">
                <User className="w-12 h-12 text-brand-orange" />
              </div>
            )}

            <button
              onClick={() => fileInputRef.current.click()}
              disabled={uploadingPhoto}
              className="absolute bottom-1 right-1 bg-brand-orange text-white p-1.5 rounded-full shadow disabled:opacity-60"
            >
              {uploadingPhoto
                ? <span className="w-3.5 h-3.5 block border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Camera className="w-3.5 h-3.5" />
              }
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Nama, kamar, dan tombol edit sebagai teks link */}
          <h3 className="font-bold text-base">{profile?.nama || '-'}</h3>
          <p className="text-xs text-gray-500 mb-1">{profile?.kamar || '-'}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1 text-xs text-brand-orange hover:underline"
          >
            <Edit2 className="w-3 h-3" /> Edit Profil
          </button>

          {/* Info Details */}
          <div className="mt-5 space-y-3 text-left">
            <div className="flex items-center bg-white border border-orange-100 rounded-xl px-4 py-3 text-xs">
              <Mail className="w-4 h-4 text-brand-orange mr-3 flex-shrink-0" />
              <span className="text-gray-600 truncate">{profile?.email || '-'}</span>
            </div>
            <div className="flex items-center bg-white border border-orange-100 rounded-xl px-4 py-3 text-xs">
              <Phone className="w-4 h-4 text-brand-orange mr-3 flex-shrink-0" />
              <span className="text-gray-600">{profile?.no_tlpn || '-'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-orange-600 transition"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </div>
  );
}