# 🥽 VR Mobile Side - Instant SBS Cinema Extension

Ekstensi browser **Manifest V3** untuk mengubah seluruh viewport browser atau pemutar video apa pun menjadi format **Side-by-Side (SBS) Virtual Cinema** instan dengan kontrol kalibrasi IPD, Zoom jarak layar, simulasi bioskop melengkung (Curved IMAX), filter peredup kecerahan, dan pelacakan kepala via sensor Gyroscope.

Dirancang khusus untuk browser mobile berbasis Chromium seperti **Kiwi Browser** dan **Lemur Browser**, serta kompatibel dengan **Google Chrome, Microsoft Edge, Brave, dan Firefox Mobile**.

---

## 🌟 Fitur Utama

### 1. 🚀 Instant Viewport Duplication
- **Universal SBS Cloning**: Tidak bergantung pada scraping URL `.mp4` / `.m3u8` atau tag video tertentu. Seketika tombol diaktifkan, seluruh render area web / video aktif diduplikasi menjadi panel kembar (Left Eye & Right Eye).
- **Zero Lag & No Audio Echo**: Sinkronisasi audio dan playback timecode 100% mulus.
- **Shadow DOM Isolation**: Tampilan antarmuka VR dan kontrol terisolasi secara total sehingga bebas bentrok CSS dari situs web mana pun (YouTube, Netflix, LK21, Vidio, Bilibili, dll.).

### 2. 📐 Visual & Penyesuaian Layar
- **Pengatur Jarak Layar (Screen Distance / Zoom)**: Mengubah skala layar virtual (50% hingga 150%) untuk sensasi duduk di kursi baris depan, tengah, atau belakang bioskop.
- **Penyesuaian IPD (Interpupillary Distance Offset)**: Menggeser margin horizontal panel mata kiri dan kanan (-50px s/d +50px) guna menghilangkan efek bayangan ganda (*double vision / crosstalk*).
- **Simulasi Layar Lengkung (Curved IMAX Cinema)**: Menghadirkan efek distorsi perspektif 3D pada sudut layar agar mata memiliki jarak fokus yang natural menyerupai layar IMAX.
- **Pengunci Rasio Aspek (Aspect Ratio Lock)**: Pilihan rasio `16:9`, `21:9` (Cinemascope Bioskop), `4:3`, dan `Auto` agar gambar tidak menjadi pipih/gepeng saat dibagi 50:50.

### 3. 👁️ Kenyamanan & Kesehatan Mata
- **Peredup Kecerahan Layar (Brightness Dimmer)**: Filter digital transparan (10% - 100%) untuk menurunkan intensitas cahaya layar di dalam ruang headset VR yang gelap guna mencegah kelelahan mata (*eye strain*).
- **Pemisah Optik (Black Optical Divider)**: Pembatas vertikal hitam pekat di antara panel kiri dan kanan untuk mengeliminasi kebocoran cahaya (*light bleed*) antar mata.

### 4. 🎮 Sensor & Kontrol Interaksi
- **Sakelar Pelacak Kepala (Gyroscope / Head Tracking)**:
  - **Mode Aktif (Immersive)**: Layar merespons orientasi HP dengan filter penghalus (*LERP*) saat kepala bergerak.
  - **Mode Nonaktif (Static Lock)**: Layar terkunci stabil di tengah pandangan mata (bebas *drifting*, sangat nyaman untuk menonton sambil berbaring).
  - **Tombol Re-Center (🎯)**: Mengatur ulang titik nol pandangan depan secara instan.
- **Floating Control HUD (Menu Kontrol Melayang)**:
  - Menu mini semi-transparan yang ramah sentuhan (*touch buttons* `+` / `-`).
  - Fitur **Auto-Hide** otomatis setelah 6 detik tidak ada interaksi, dan muncul kembali saat layar diketuk dua kali (*double tap*).
- **One-Click Reset & Exit**:
  - Tombol **Reset Defaults**: Mengembalikan seluruh parameter ke setelan optimal awal.
  - Tombol **Exit VR**: Keluar seketika ke tampilan website normal.

---

## 📁 Struktur File

```
/root/developer/Vr Mobile Side/
├── manifest.json            # Manifest V3 Configuration
├── background.js            # Service Worker & Context Menu Handler
├── content.js               # Core Engine: Instant Duplication, 3D Transforms, Gyro & HUD
├── content.css              # Shadow DOM Stylesheet
├── popup.html               # UI Popup Ekstensi
├── popup.css                # Styling Popup Dark Cinema
├── popup.js                 # Kontrol Popup & Penyimpanan Setelan
├── demo_page.html           # Halaman Demo Mandiri untuk Pengujian
├── generate_icons.py        # Generator Aset Ikon PNG
├── icons/                   # Aset Ikon Ekstensi
│   ├── icon.svg
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md                # Dokumentasi & Panduan
```

---

## 📱 Panduan Instalasi di HP (Kiwi Browser / Lemur Browser)

1. Pastikan folder `Vr Mobile Side` tersimpan di memori ponsel atau di-zip lalu diekstrak ke folder penyimpanan.
2. Buka **Kiwi Browser** atau **Lemur Browser** di HP Android Anda.
3. Buka halaman ekstensi dengan mengetik `chrome://extensions` di kolom alamat browser.
4. Aktifkan **Developer Mode** (Mode Pengembang) di pojok kanan atas.
5. Klik tombol **+(from .zip / .crx / folder)** atau **Load unpacked**.
6. Pilih folder `Vr Mobile Side`.
7. Ekstensi **VR Mobile Side** kini siap digunakan!

---

## 💻 Panduan Instalasi di Desktop (Chrome / Edge / Brave)

1. Buka browser Chromium di PC/Laptop.
2. Buka `chrome://extensions` (atau `edge://extensions`).
3. Aktifkan **Developer Mode**.
4. Klik **Load unpacked** dan arahkan ke folder `/root/developer/Vr Mobile Side`.
5. Buka file `demo_page.html` untuk langsung menguji fungsi Side-by-Side dan kalibrasi HUD!

---

## 🎬 Alur Penggunaan (User Flow)

1. Buka website streaming video/film apa pun di browser.
2. Mulai putar video dan aktifkan fullscreen (opsional).
3. Klik ikon ekstensi **VR Mobile Side** atau tekan shortcut <kbd>Alt</kbd> + <kbd>V</kbd>.
4. Layar seketika terbelah dua (Side-by-Side) dan **Floating Control HUD** muncul.
5. Sesuaikan **Jarak Layar (Zoom)**, **IPD**, dan **Kecerahan** sesuai kenyamanan mata Anda.
6. Masukkan HP ke dalam headset **VR Box** / **Google Cardboard**.
7. Selamat menikmati sensasi bioskop virtual IMAX pribadi Anda!

---

## ⌨️ Pintasan Keyboard (Shortcut Keys)
- <kbd>Alt</kbd> + <kbd>V</kbd> : Masuk / Keluar Mode VR SBS
- **Double Tap Layar** : Tampilkan / Sembunyikan Floating Control HUD
