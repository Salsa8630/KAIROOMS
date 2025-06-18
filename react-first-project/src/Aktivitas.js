import React, { useState } from 'react';
import './Aktivitas.css';
import { useNavigate } from 'react-router-dom';
import logo from './KAI_ROOMS_logo.png';

const Aktivitas = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1)); // February 2025
  const [selectedDate, setSelectedDate] = useState(12);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const todaysEvents = [
    {
      time: '12 Feb, 13:00-14:45',
      title: 'Perubahan GAPEKA',
      unit: 'Unit Operasi'
    },
    {
      time: '12 Feb, 16:00-16:30',
      title: 'Posko KAI Lebaran Idul Fitri',
      unit: 'Unit SDM'
    },
    {
      time: '26 Feb, 09:00-11:00',
      title: 'Audit 100 Tahun KAI',
      unit: 'Unit Operasi'
    }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Adjust for Monday start

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="aktivitas-container">
      <div className="aktivitas-header">
        <button className="back-button-aktivitas" onClick={handleBackToDashboard}>
          ←
        </button>
        <div className="aktivitas-title">
          <h1>BOARD SCHEDULE CALENDER MEETING</h1>
        </div>
        <div className="kai-rooms-logo">
          <img src={logo} alt="KAI ROOMS Logo" className="logo-icon" />
          <span className="logo-text">KAI ROOMS</span>
        </div>
      </div>

      <div className="aktivitas-content">
        <div className="calendar-section">
          <div className="calendar-header">
            <button className="nav-button" onClick={handlePrevMonth}>‹</button>
            <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
            <button className="nav-button" onClick={handleNextMonth}>›</button>
          </div>

          <div className="calendar-grid">
            <div className="day-headers">
              {dayNames.map(day => (
                <div key={day} className="day-header">{day}</div>
              ))}
            </div>
            
            <div className="calendar-days">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${day ? 'valid-day' : 'empty-day'} ${
                    day === selectedDate ? 'selected' : ''
                  } ${day === 12 || day === 26 ? 'has-event' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="events-section">
          <h3>Today's Events</h3>
          <div className="events-list">
            {todaysEvents.map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-time">{event.time}</div>
                <div className="event-title">{event.title}</div>
                <div className="event-unit">{event.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aktivitas;