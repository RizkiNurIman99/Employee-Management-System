# 🕒 ABSENSI: Real-Time IoT Attendance System

Sistem absensi otomatis berbasis IoT yang mengintegrasikan **Arduino Uno** dengan ekosistem **MERN Stack** (MongoDB, Express, React, Node.js). Proyek ini memungkinkan pemantauan kehadiran secara instan melalui dashboard web menggunakan teknologi **Socket.io**.

---

## 🚀 Fitur Utama
* **Real-Time Monitoring**: Data kehadiran langsung muncul di dashboard tanpa perlu *refresh* halaman.
* **RFID Integration**: Menggunakan sensor MFRC522 untuk identifikasi unik tiap pengguna.
* **Live Connection Status**: Indikator status koneksi antara perangkat hardware dan server.
* **Responsive Dashboard**: Tampilan modern yang dioptimalkan untuk berbagai ukuran layar.
* **Data Persistence**: Riwayat absensi tersimpan aman di database MongoDB.

---

## 🛠️ Tech Stack

### Frontend
* **React.js** (Vite)
* **Tailwind CSS** (Styling)
* **Socket.io-client** (Real-time communication)
* **Lucide React** (Icons)

### Backend
* **Node.js & Express.js**
* **MongoDB & Mongoose** (Database)
* **Socket.io** (WebSockets)
* **SerialPort** (Communication bridge with Arduino)

### Hardware
* **Arduino Uno**
* **RFID Reader MFRC522**
* **Buzzer & LED** (Status indicators)

---

## 🔌 Arsitektur Sistem

Sistem ini bekerja melalui aliran data berikut:
1.  **Scanning**: Pengguna menempelkan kartu RFID ke sensor.
2.  **Arduino**: Membaca UID kartu dan mengirimkannya ke PC melalui koneksi Serial (USB).
3.  **Backend**: Node.js membaca data serial, mencocokkan UID dengan database MongoDB.
4.  **Socket.io**: Server mengirimkan event ke Frontend jika data valid.
5.  **Frontend**: Dashboard React memperbarui tampilan secara otomatis.

---

## 📂 Struktur Folder

```text
ABSENSI/
├── arduino/          # Source code C++ (.ino) untuk Arduino
├── backend/          # Node.js server, Socket.io, & MongoDB Models
└── frontend/         # React.js application (Vite)
