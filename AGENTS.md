# 🤖 AGENT RULES: PROTOKOL WAJIB CEK ERROR & VALIDASI KODE

Dokumen ini adalah pedoman wajib bagi AI Agent (Antigravity / Gemini Pair Programmer) dalam mengerjakan dan mengembangkan proyek **VR Mobile Side**.

---

## 🚨 ATURAN UTAMA: WAJIB CEK ERROR SETIAP SELESAI EDITING

Setiap kali melakukan perubahan kode (editing/menambahkan fitur/memperbaiki bug), AI Agent **DIWAJIBKAN SECARA MUTLAK** untuk melakukan verifikasi dan pengecekan error sebelum memberikan respon kepada pengguna.

---

### 1. Pengecekan TypeScript Compiler (`tsc`)
Wajib menjalankan pengecekan tipe dan sintaks statis dengan `tsc`:
```bash
npx --yes -p typescript tsc --project ./tsconfig.json
```
* **Kriteria Lulus**: `Exit code: 0` (0 error, 0 warning).
* Jika ditemukan error tipe/properti tidak ditemukan, agent wajib memperbaikinya dan menjalankan ulang perintah di atas sampai bersih.

---

### 2. Validasi Runtime Syntax Node.js
Wajib memastikan seluruh berkas JavaScript dapat dievaluasi tanpa `SyntaxError`:
```bash
node -e "
const fs = require('fs');
['background.js', 'content.js', 'popup.js'].forEach(f => {
  new Function(fs.readFileSync(f, 'utf8'));
  console.log('✓ ' + f + ': Validated successfully');
});
"
```
* **Kriteria Lulus**: Seluruh berkas JavaScript lolos evaluasi fungsi runtime.

---

### 3. Validasi Integritas Manifest & Konfigurasi
Wajib memastikan format JSON valid dan sesuai spesifikasi Chrome Extension Manifest V3:
```bash
node -e "
const fs = require('fs');
JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
console.log('✓ Manifest & Config Validated');
"
```

---

## 🛡️ PEDOMAN KUALITAS & REGRESI FITUR

1. **Anti-Regresi (Preservasi Fitur)**:
   * Jangan pernah menghapus atau merusak fitur yang sudah berjalan stabil (seperti *Twin Mirroring*, *Smart Video Duplication*, *4 Gyro Modes*, *Gaze Downward Gestures*, dan *IPD/Zoom HUD*).
2. **Isolasi Mode OFF**:
   * Pastikan saat ekstensi dalam keadaan **OFF** (`state.enabled === false`), tidak ada event listener atau interceptor yang mengganggu penjelajahan normal website pengguna.
3. **Smart Failover**:
   * Sistem duplikasi video wajib mendukung multi-tier failover (*CaptureStream* -> *Direct Source Cloning* -> *Hardware Canvas Mirroring*).

---

## 📋 DAFTAR CEK SEBELUM MENYELESAIKAN TUGAS
- [ ] Kode diedit sesuai permintaan pengguna.
- [ ] `tsc` dijalankan dan menghasilkan **0 error**.
- [ ] Runtime evaluasi syntax JavaScript bernilai **Valid**.
- [ ] Berkas konfigurasi (`manifest.json`) valid.
- [ ] Laporan hasil pengecekan error disampaikan secara transparan kepada pengguna.
