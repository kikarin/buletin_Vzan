# BuletinVzan - Platform Buletin Digital

BuletinVzan adalah platform buletin digital modern yang memungkinkan pengguna untuk membuat, membaca, dan berbagi konten dalam format buletin digital. Platform ini dirancang dengan fokus pada pengalaman pengguna yang intuitif dan tampilan yang menarik.

## 🌟 Fitur Utama

### Untuk Pembaca
- Feed personalisasi berdasarkan topik yang diminati
- Sistem bookmark untuk menyimpan buletin favorit
- Fitur like dan komentar untuk interaksi
- Notifikasi real-time untuk update terbaru
- Sistem subscribe untuk mengikuti penulis favorit

### Untuk Penulis
- Editor Ckeditor dengan dukungan format kaya
- Manajemen buletin dan postingan
- Sistem publikasi dengan opsi public/private
- Manajemen profil dan branding

## 🛠️ Teknologi yang Digunakan

### Frontend
- React.js dengan Vite sebagai build tool
- Tailwind CSS untuk styling
- React Router untuk navigasi
- React Hot Toast untuk notifikasi
- CKEditor 5 untuk editor konten
- Lucide React untuk ikon
- Axios untuk HTTP requests

### Backend
- Firebase Authentication untuk autentikasi
- Cloud Firestore untuk database
- Cloudinary untuk manajemen gambar
- Firebase Storage untuk penyimpanan file

### Integrasi
- Google Sign-In
- Cloudinary Image Upload
- Firebase Real-time Database

## 🚀 Cara Menjalankan Proyek Di Local Anda

1. Install dependencies
```bash
npm install
```

2. Buat file `.env` dan isi dengan konfigurasi Firebase dan Cloudinary
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

3. Jalankan development server
```bash
npm run dev
```

## 📁 Struktur Proyek

```
src/
├── components/        # Komponen React yang dapat digunakan kembali
├── pages/             # Halaman-halaman aplikasi
├── services/          # Layanan Firebase dan integrasi lainnya
├── layouts/           # Layout komponen
├── hooks/             # Custom React hooks
├── contexts/          # React contexts
└── utils/             # Fungsi utilitas
```

## 🔒 Autentikasi

Platform menggunakan Firebase Authentication dengan dukungan:
- Email/Password
- Google Sign-In
- Sistem onboarding untuk pengguna baru

## 📱 Responsivitas

Aplikasi dirancang responsif dengan pendekatan mobile-first menggunakan Tailwind CSS:
- Breakpoints untuk mobile, tablet, dan desktop
- Layout adaptif untuk berbagai ukuran layar
- Komponen yang responsif

## 🎨 UI/UX Features

- Animasi smooth untuk interaksi
- Loading states dan skeleton screens
- Error handling dengan toast notifications
- Infinite scroll untuk feed
- Image lazy loading

## 🤝 Kontak

Untuk pertanyaan dan kolaborasi, silakan hubungi:
- Email: milhampauzan@gmail.com
- Linkedin: [Ilham Pauzan](www.linkedin.com/in/ilham-pauzan)
- Website: [PortoZan](https://porto-zan.vercel.app)
