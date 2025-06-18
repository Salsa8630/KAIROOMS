import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import kaiLogo from './KAI_ROOMS_logo.png'; 



const meetingsToday = [
  {
    title: "Rapat Koordinasi Tim GAPEKA",
    time: "17:10",
    endTime: "18:00",
    lokasi: "Lantai 2",
    room: "Batavia",
    unit: "Unit Operasi",
    status: "in_use"
  },
  {
    title: "Perubahan GAPEKA",
    time: "13:00",
    endTime: "14:45",
    lokasi: "Lantai 3",
    room: "Borneo",
    unit: "Unit Operasi",
    status: "reserved"
  },
  {
    title: "Posko KAI Lebaran Idul Fitri",
    time: "16:00",
    endTime: "16:30",
    lokasi: "Lantai 1",
    room: "Sumatera",
    unit: "Unit SDM",
    status: "reserved"
  },
  {
    title: "Rapat A",
    time: "",
    endTime: "",
    lokasi: "Lantai 4",
    room: "Kalimantan",
    unit: "",
    status: "available"
  }
];

function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [reminder, setReminder] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [remindedMeetings, setRemindedMeetings] = useState([]);

  
  const [formData, setFormData] = useState({
    penyelenggara: 'Unit Operasi',
    namaRapat: '',
    tanggal: '',
    waktuMulai: '',
    waktuSelesai: '',
    lokasi: '',
    ruangan: '',
    jenisRapat: 'Online',
    kapasitas: '',
    catatan: ''
  });

    useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
  const timer = setInterval(() => {
    const now = new Date();

    meetingsToday.forEach((meeting, index) => {
      if (!meeting.time) return;

      const [hour, minute] = meeting.time.split(':').map(Number);
      const meetingTime = new Date();
      meetingTime.setHours(hour, minute, 0, 0);

      const diffMinutes = Math.floor((meetingTime - now) / (1000 * 60));

      // Kasih reminder kalau belum pernah dikasih reminder untuk rapat ini
      if (diffMinutes >= 1 && diffMinutes <= 10 && !remindedMeetings.includes(index)) {
        setReminder(`🔔 Anda mempunyai rapat "${meeting.title}" dalam ${diffMinutes} menit!`);
        setRemindedMeetings(prev => [...prev, index]); // tambahkan index ke list reminder
      }
    });

    setCurrentTime(now); // update waktu sekarang juga
  }, 1000);

  return () => clearInterval(timer);
}, [remindedMeetings]);





  const formatDate = (date) => {
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  
 const handleSubmit = (e) => {
  e.preventDefault();

  // Validasi form terlebih dahulu
  if (!formData.namaRapat || !formData.tanggal || !formData.waktuMulai || !formData.waktuSelesai) {
    alert('Mohon lengkapi semua field yang wajib diisi');
    return;
  }

  console.log('Form Data:', formData); // untuk debugging
  console.log('Jenis Rapat:', formData.jenisRapat); // untuk debugging

  if (formData.jenisRapat === 'Online') {
    // Show popup for Google Meet link
    setShowLinkPopup(true);
  } else if (formData.jenisRapat === 'Offline') {
    // Navigate to room status page with booking data
    console.log('Navigating to room status...'); // untuk debugging
    navigate('/room-status', { state: formData });
    setShowPopup(false);
  } else if (formData.jenisRapat === 'Hybrid') {
    // For hybrid, show link popup
    console.log('Navigating to Hybrid Meeting Status...'); // debugging
  navigate('/HybridMeet', { state: formData });
  setShowPopup(false);
  } else {
    alert('Mohon pilih jenis rapat');
    alert('Booking submitted! (Implement your logic)');
    setShowPopup(false);
  }
};

const handleConfirmLink = () => {
  if (!meetingLink.trim()) {
    alert("Link Google Meet tidak boleh kosong.");
    return;
  }

  const updatedBooking = {
    ...formData,
    linkMeet: meetingLink
  };

  console.log("Data booking:", updatedBooking);

  alert("Booking submitted dengan link!");
  setShowLinkPopup(false);
  setShowPopup(false); // tutup popup utama
};

const handleSearchMeeting = () => {
  alert(`Fitur pencarian belum diimplementasikan. Anda mencari: "${searchQuery}"`);
};

const handleSearch = () => {
  if (searchQuery.trim() === '') {
    setSearchResults([]);
    return;
  }
  const filtered = meetingsToday.filter((meeting) =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  setSearchResults(filtered);
};

const handleShowDetail = (meeting) => {
  setSelectedMeeting(meeting);
  setShowDetailPopup(true);
};

const navigate = useNavigate();
const keRiwayatRapat = () => {
  navigate('/riwayat-rapat');
};
const goToAktivitas = () => {
  navigate('/aktivitas');
};

const goTonotifikasi = () => {
  navigate('/notifikasi');
};

const goToPengaturan = () => {
    navigate('/pengaturan');
  };


  // Tambahkan sebelum return (
const renderStatus = (status, endTime) => {
  if (status === 'in_use') {
    return <span className="status red">🔴 In Use until {endTime}</span>;
  } else if (status === 'reserved') {
    return <span className="status yellow">🟡 Reserved Soon</span>;
  } else if (status === 'available') {
    return <span className="status green">🟢 Available</span>;
  } else {
    return <span className="status gray">Unknown</span>;
  }
};

 return (
    <div className="dashboard-container">
      <aside className="sidebar">
<div className="brand-complete">
  <div className="brand-row">
    <img src={kaiLogo} alt="KAI ROOMS Logo" className="logo-img" />
    <h2>KAI ROOMS</h2>
  </div>
  <p className="desc">Optimizing Collaboration,<br />Enhancing Productivity</p>
</div>
        <nav>
          <ul>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="white"/>
              </svg>
              Home
            </li>
            <li onClick={goToAktivitas} style={{cursor: 'pointer'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" fill="white"/>
              </svg>
              Schedule
            </li>
            <li onClick={goTonotifikasi} style={{cursor: 'pointer'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.89 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5S10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="white"/>
              </svg>
              Notification
            </li>
            <li onClick={goToPengaturan} style={{cursor: 'pointer'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12S13.933 8.5 12 8.5 8.5 10.067 8.5 12 10.067 15.5 12 15.5ZM19.43 12.97C19.47 12.65 19.5 12.33 19.5 12S19.47 11.35 19.43 11.03L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.51 2.42L9.13 5.07C8.52 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.72 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11.03C4.53 11.35 4.5 11.67 4.5 12C4.5 12.33 4.53 12.65 4.57 12.97L2.46 14.63C2.27 14.78 2.21 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.95C7.96 18.35 8.52 18.68 9.13 18.93L9.51 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.28 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.97Z" fill="white"/>
              </svg>
              Settings
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7L15.59 5.59L9 12.17L13.17 16.34L11.76 17.76L9 15L17 7ZM4 12C4 16.97 7.58 21 12 21C13.95 21 15.74 20.38 17.25 19.34L15.97 18.06C14.74 18.95 13.42 19.5 12 19.5C8.41 19.5 5.5 16.59 5.5 13C5.5 9.41 8.41 6.5 12 6.5C15.59 6.5 18.5 9.41 18.5 13C18.5 14.42 17.95 15.74 17.06 16.97L18.34 18.25C19.38 16.74 20 14.95 20 13C20 7.03 16.42 3 12 3S4 7.03 4 12Z" fill="white"/>
              </svg>
              Log out
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-dashboard">
        <div className="header-bar">
          <div>{formatDate(currentTime)}</div>
          <div>{formatTime(currentTime)}</div>
        </div>

        <div className="greeting">
          <h3>SELAMAT DATANG, SALSABILLA!</h3>
          <p><i>Lihat jadwal rapatmu hari ini dan kelola meeting dengan mudah.</i></p>
          <p><b>Rapat Koordinasi Tim GAPEKA</b><br />17:10 - 18:00 WIB<br /><span className="upcoming">Upcoming</span> <a href="#">[Gabung Sekarang]</a></p>
          {reminder && <p className="reminder">{reminder}</p>}
        </div>

        <div className="room-status-wrapper">
          <div className="room-status">
            <table>
              <thead>
                <tr>
                  <th>Judul Rapat</th>
                  <th>Lokasi</th>
                  <th>Ruangan</th>
                  <th>Unit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {meetingsToday.map((m, i) => (
                  <tr key={i}>
                    <td>{m.title}</td>
                    <td>{m.lokasi}</td>
                    <td>{m.room}</td>
                    <td>{m.unit || '-'}</td>
                    <td>{renderStatus(m.status, m.endTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="book-btn" onClick={() => setShowPopup(true)}>Book a Room</button>
          </div>
        </div>

        <div className="actions">
  <button className="action-btn" onClick={() => setShowSearchPopup(true)}>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF6B35" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 
      6.5 6.5 0 109.5 16a6.471 6.471 0 004.23-1.57l.27.28v.79l5 
      4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 
      9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z"/>
  </svg>
  Search Meet
</button>

<button className="action-btn" onClick={() => navigate('/riwayat-rapat')}>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF6B35" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 
      1.1.9 2 2 2h12c1.1 0 2-.9 
      2-2V8l-6-6zm2 18H6V4h7v5h5v11z"/>
  </svg>
  Riwayat Rapat
</button>

</div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-form">
              <h2>BOOK A ROOM</h2>
              <form onSubmit={handleSubmit}>
                <label>Penyelenggara</label>
                <select name="penyelenggara" value={formData.penyelenggara} onChange={handleChange}>
                  <option>Unit Operasi</option>
                  <option>Sistem Informasi</option>
                  <option>Jalan Rel dan Jembatan</option>
                  <option>Unit SDM</option>
                   <option>Keuangan</option>
                    <option>Hukum</option>
                     <option>Listrik Aliran Atas</option>
                      <option>Sarana</option>
                       <option>Sintelis</option>
                       <option>KNA</option>
                        <option>Humas</option>
                         <option>Angkutan Penumpang</option>
                          <option>Bangunan</option>
                           <option>Pengamanan</option>
                            <option>Kesehatan</option>
                             <option>Fasilitas Penumpang</option>
                              <option>Penjagaan Aset</option>
                               <option>PBJ</option>
                </select>

                <label>Nama Rapat</label>
                <input type="text" name="namaRapat" value={formData.namaRapat} onChange={handleChange} />

                <div className="row">
                  <div>
                    <label>Tanggal</label>
                    <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} />
                  </div>
                  <div>
                    <label>Waktu Mulai</label>
                    <input type="time" name="waktuMulai" value={formData.waktuMulai} onChange={handleChange} />
                  </div>
                  <div>
                    <label>Waktu Selesai</label>
                    <input type="time" name="waktuSelesai" value={formData.waktuSelesai} onChange={handleChange} />
                  </div>
                </div>

                <div className="row">
                  <div class="form-group">
                    <label>Lokasi</label>
                    <input type="text" name="lokasi" value={formData.lokasi} onChange={handleChange} />
                  </div>

                  
                  <div className="form-group">
  <label>Ruangan</label>
  <select name="ruangan" value={formData.ruangan} onChange={handleChange}>
    <option>Batavia</option>
    <option>Sunda Kelapa</option>
    <option>Nusantara</option>
    <option>Sriwijaya</option>
    <option>Gajah Mada</option>
    <option>Borneo</option>
  </select>
</div>
                </div>
                <label>Jenis Rapat</label>
                <div className="row radio">
                  <label><input type="radio" name="jenisRapat" value="Online" checked={formData.jenisRapat === 'Online'} onChange={handleChange} /> Online</label>
                  <label><input type="radio" name="jenisRapat" value="Offline" checked={formData.jenisRapat === 'Offline'} onChange={handleChange} /> Offline</label>
                  <label><input type="radio" name="jenisRapat" value="Hybrid" checked={formData.jenisRapat === 'Hybrid'} onChange={handleChange} /> Hybrid</label>
                </div>
                <label>Jumlah Kapasitas</label>
                <input type="number" name="kapasitas" value={formData.kapasitas} onChange={handleChange} />

                <label>Catatan Tambahan</label>
                <textarea name="catatan" value={formData.catatan} onChange={handleChange}></textarea>

                <div className="row btns">
                  <button type="button" className="email-btn">📩 Sent Via Email</button>
                  <button type="button" onClick={() => setShowPopup(false)}>Batal</button>
                  <button type="submit" className="buat-btn">Buat</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <aside className="meeting-list">
        <h4>Upcoming Meeting List</h4>
        <div className="list-section">
          <p><strong>12 Feb, 10:00-11:00</strong><br />Perubahan GAPEKA<br />Unit Operasi</p>
          <p><strong>12 Feb, 16:00-16:30</strong><br />Posko KAI Lebaran Idul Fitri<br />Unit SDM</p>
          <hr />
          <p><strong>Tomorrow, 1 Apr</strong><br />08:00-09:30<br />Rapat Tim IT<br />Unit System Information</p>

          {showLinkPopup && (
  <div className="popup-overlay">
    <div className="popup-link-form">
      <h2>Masukkan Link Google Meet</h2>
      <input
        type="text"
        placeholder="https://meet.google.com/abc-defg-hij"
        value={meetingLink}
        onChange={(e) => setMeetingLink(e.target.value)}
      />
      <div className="btns">
        <button className="confirm-btn" onClick={handleConfirmLink}>Konfirmasi</button> 
      </div>
    </div>
  </div>
)}

   </div>
   </aside>
  {showSearchPopup && (
  <div className="popup-overlay">
  <div className="popup-search">
    <button className="close-btn" onClick={() => setShowSearchPopup(false)}>✕</button>
    <div className="popup-header">
      <h2><span className="bold-purple">LET’S FIND</span> YOUR MEETING!</h2>
    </div>

    <h3 className="popup-subtitle">Type The Meeting Name Here!</h3>

    <input 
      type="text" 
      placeholder="Enter meeting name..." 
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />

    <button className="search-now-btn" onClick={handleSearch}>Search Now</button>


      {searchResults.length > 0 ? (
        <ul className="search-result-list">
          {searchResults.map((meeting, index) => (
  <li key={index} className="search-result-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <strong>{meeting.title}</strong><br />
      waktu: {meeting.time} - {meeting.endTime}<br />
      Ruangan: {meeting.room}<br />
      Unit: {meeting.unit}<br />
      status: {meeting.status}<br />
    </div>
    <button className="detail-btn" onClick={() => handleShowDetail(meeting)}>DETAIL</button>
  </li>
          ))}
          {showDetailPopup && selectedMeeting && (
  <div className="popup-detail">
    <div className="popup-card">
      <h2>MEETING INFORMATION</h2>
      <p><strong>Meeting Name:</strong> {selectedMeeting.title}</p>
      <p><strong>Date:</strong> {selectedMeeting.date}</p> 
      <p><strong>Time:</strong> {selectedMeeting.time} - {selectedMeeting.endTime} WIB</p>
      <p><strong>Organizer:</strong> {selectedMeeting.unit}</p>
      <p><strong>Location:</strong> {selectedMeeting.room}</p>
      <p><strong>Mode:</strong> Online</p> 
      <button className="join-btn">Join Now</button>
      <button className="close-btn-search" onClick={() => setShowDetailPopup(false)}>Find Another Meeting</button>
    </div>
  </div>
)}
        </ul>
      ) : null}
    </div>
  </div>
)}
    </div>
  );
}
export default Dashboard;
