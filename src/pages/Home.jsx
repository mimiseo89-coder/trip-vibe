import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Calendar, Users, Star, ArrowRight, Trash2, MapPin } from 'lucide-react';
import { getSavedTrips, deleteTrip } from '../utils/storage';
import heroBg from '../assets/hero-bg.png';

/**
 * Home Page - The landing experience for TripMate AI.
 * Focuses on emotional appeal and the core value proposition.
 */
const Home = ({ onStart, onViewTrip }) => {
  const [savedTrips, setSavedTrips] = useState([]);

  useEffect(() => {
    setSavedTrips(getSavedTrips());
  }, []);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('정말 이 여행 일정을 삭제하시겠습니까?')) {
      deleteTrip(id);
      setSavedTrips(getSavedTrips());
    }
  };

  const calculateDDay = (startDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'D-Day';
    return diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-overlay"></div>
        <img src={heroBg} alt="Travel Destination" className="hero-img" />
        
        <div className="container hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="brand"
          >
            <Plane className="brand-icon" />
            <span className="brand-name">TripMate AI</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-title"
          >
            계획은 AI에게,<br /> 
            <span>여행의 설렘</span>만 가져가세요.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-subtitle"
          >
            여행지, 기간, 스타일만 알려주시면<br />
            가장 완벽한 동선과 체크리스트를 제안해 드립니다.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="hero-actions"
          >
            <button className="btn-primary" onClick={onStart}>
              새 여행 만들기 <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </header>

      {/* Saved Trips Section */}
      {savedTrips.length > 0 && (
        <section className="saved-trips container">
          <div className="section-header">
            <h2>나의 여행 리스트</h2>
            <p>저장된 여행 일정을 확인하고 관리하세요.</p>
          </div>
          <div className="trips-grid">
            {savedTrips.map((trip) => (
              <motion.div 
                key={trip.id}
                className="trip-card glass"
                whileHover={{ y: -5 }}
                onClick={() => onViewTrip(trip)}
              >
                <div className="trip-dday">{calculateDDay(trip.startDate)}</div>
                <div className="trip-info">
                  <div className="trip-destination">
                    <MapPin size={16} />
                    <span>{trip.destination}</span>
                  </div>
                  <div className="trip-date">
                    <Calendar size={14} />
                    <span>{trip.startDate} ~ {trip.endDate}</span>
                  </div>
                </div>
                <button 
                  className="btn-delete" 
                  onClick={(e) => handleDelete(e, trip.id)}
                  title="삭제"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Features Preview */}
      <section className="features-preview container">
        <div className="feature-card glass">
          <Calendar className="feature-icon" />
          <h3>AI 맞춤 일정</h3>
          <p>이동 동선을 고려한 최적의 코스 설계</p>
        </div>
        <div className="feature-card glass">
          <Star className="feature-icon" />
          <h3>취향 기반 추천</h3>
          <p>나의 여행 스타일에 맞는 장소 추천</p>
        </div>
        <div className="feature-card glass">
          <Users className="feature-icon" />
          <h3>준비물 체크리스트</h3>
          <p>놓치기 쉬운 필수품 자동 생성</p>
        </div>
      </section>

      <style>{`
        .home-page {
          min-height: 100vh;
          position: relative;
          color: var(--text-main);
          overflow-x: hidden;
          background-color: var(--bg-light);
        }

        .hero {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--white);
        }

        .hero-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -2;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(30, 58, 95, 0.4), rgba(30, 58, 95, 0.8));
          z-index: -1;
        }

        .brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 2rem;
        }

        .brand-icon {
          color: var(--secondary-color);
        }

        .brand-name {
          font-family: 'Outfit';
          font-weight: 700;
          font-size: 1.5rem;
          letter-spacing: -0.5px;
        }

        .hero-title {
          font-family: 'Outfit';
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          letter-spacing: -1px;
        }

        .hero-title span {
          color: var(--secondary-color);
        }

        .hero-subtitle {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .btn-primary {
          background-color: var(--secondary-color);
          color: var(--white);
          padding: 1rem 2.5rem;
          border-radius: 100px;
          font-size: 1.1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 auto;
          box-shadow: 0 10px 20px rgba(255, 154, 60, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(255, 154, 60, 0.4);
        }


        .saved-trips {
          padding-top: 80px;
          padding-bottom: 40px;
        }

        .section-header {
          margin-bottom: 32px;
          text-align: left;
        }

        .section-header h2 {
          font-family: 'Outfit';
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .section-header p {
          opacity: 0.7;
          font-size: 1.1rem;
        }

        .trips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .trip-card {
          position: relative;
          padding: 24px;
          border-radius: 20px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: var(--white);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: var(--shadow-sm);
          transition: var(--transition-smooth);
        }

        .trip-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--secondary-color);
        }

        .trip-dday {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--secondary-color);
          color: var(--white);
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .trip-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .trip-destination {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .trip-date {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .btn-delete {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        .btn-delete:hover {
          background: rgba(255, 59, 48, 0.1);
          color: #ff3b30;
        }

        .features-preview {
          padding: 80px 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          position: relative;
          z-index: 10;
        }


        .feature-card {
          padding: 2rem;
          border-radius: var(--border-radius);
          text-align: center;
          transition: var(--transition-smooth);
        }

        .feature-card:hover {
          transform: translateY(-10px);
        }

        .feature-icon {
          color: var(--secondary-color);
          width: 32px;
          height: 32px;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .feature-card p {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .features-preview {
            grid-template-columns: 1fr;
            margin-top: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
