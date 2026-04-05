import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowLeft, MoreHorizontal, Sparkles } from 'lucide-react';

/**
 * ScheduleView - Displays the AI-generated itinerary.
 * Future enhancement: Fetch real data from Gemini API.
 */
const ScheduleView = ({ tripData, onBack }) => {
  const schedule = React.useMemo(() => {
    if (!tripData?.startDate || !tripData?.endDate) {
      return [{
        day: 1,
        date: '2024-04-05',
        places: [
          { name: '공항 도착 및 숙소 체크인', time: '14:00', reason: '편안한 여행의 시작' },
          { name: '현지 유명 맛집 탐방', time: '18:00', reason: '현지의 맛을 느낄 수 있는 첫 저녁' },
          { name: '야경 명소 산책', time: '20:30', reason: '아름다운 야경과 함께하는 여유' }
        ]
      }];
    }

    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return Array.from({ length: diffDays }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const demoPlaces = [
        [
          { name: '공항 도착 및 숙소 체크인', time: '14:00', reason: '편안한 여행의 시작' },
          { name: '현지 유명 맛집 탐방', time: '18:00', reason: '현지의 맛을 느낄 수 있는 첫 저녁' },
          { name: '야경 명소 산책', time: '20:30', reason: '아름다운 야경과 함께하는 여유' }
        ],
        [
          { name: '브런치 카페 방문', time: '10:30', reason: '여유로운 아침 식사' },
          { name: '주요 랜드마크 관광', time: '13:00', reason: '놓칠 수 없는 여행 코스' },
          { name: '전통 시장 구경', time: '16:30', reason: '현지의 정취를 느끼는 시간' }
        ],
        [
          { name: '공원 산책 및 휴식', time: '11:00', reason: '마지막 날의 여유' },
          { name: '기념품 쇼핑', time: '14:00', reason: '가족과 친구들을 위한 선물' },
          { name: '공항 이동 및 복귀', time: '17:00', reason: '즐거웠던 여행 마무리' }
        ]
      ];

      return {
        day: i + 1,
        date: dateStr,
        places: demoPlaces[i % 3]
      };
    });
  }, [tripData]);

  return (
    <div className="schedule-page">
      <div className="container py-8">
        <header className="schedule-header">
          <button className="btn-back-light" onClick={onBack}>
            <ArrowLeft size={18} /> 이전으로
          </button>
          
          <div className="trip-summary mt-6">
            <h1 className="trip-dest">{tripData?.destination || '여행지'}</h1>
            <div className="trip-meta">
              <span><Calendar size={14} /> {tripData?.startDate} ~ {tripData?.endDate}</span>
              <span><Sparkles size={14} /> {tripData?.style} 스타일</span>
            </div>
          </div>
        </header>

        <section className="itinerary mt-10">
          <div className="ai-badge">
            <Sparkles size={14} /> AI가 추천하는 최적의 일정입니다
          </div>

          <div className="timeline-container">
            {schedule.map((day) => (
              <div key={day.day} className="day-section">
                <div className="day-indicator">
                  <span className="day-num">Day {day.day}</span>
                  <span className="day-date">{day.date}</span>
                </div>

                <div className="day-cards">
                  {day.places.map((place, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="place-card glass"
                    >
                      <div className="card-time">
                        <Clock size={14} /> {place.time}
                      </div>
                      <div className="card-content">
                        <h3>{place.name}</h3>
                        <p>{place.reason}</p>
                      </div>
                      <button className="btn-more">
                        <MoreHorizontal size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .schedule-page {
          min-height: 100vh;
          background-color: var(--bg-light);
          color: var(--text-main);
        }

        .btn-back-light {
          display: flex;
          align-items: center;
          gap: 6px;
          background: white;
          border: 1px solid #E2E8F0;
          color: var(--text-muted);
          padding: 8px 14px;
          border-radius: 50px;
          font-size: 0.9rem;
        }

        .trip-dest {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--primary-color);
        }

        .trip-meta {
          display: flex;
          gap: 16px;
          color: var(--text-muted);
          font-size: 0.95rem;
          margin-top: 4px;
        }

        .trip-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 154, 60, 0.1);
          color: var(--secondary-color);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .day-indicator {
          margin-bottom: 16px;
        }

        .day-num {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-right: 8px;
        }

        .day-date {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .day-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          padding-left: 20px;
          border-left: 2px dashed #E2E8F0;
          margin-left: 10px;
        }

        .place-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          border-radius: 16px;
          background: white;
          box-shadow: var(--shadow-sm);
          position: relative;
        }

        .place-card::before {
          content: '';
          position: absolute;
          left: -27px;
          top: 24px;
          width: 12px;
          height: 12px;
          background: var(--secondary-color);
          border-radius: 50%;
          border: 2px solid white;
        }

        .card-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--secondary-color);
          background: rgba(255, 154, 60, 0.05);
          padding: 4px 8px;
          border-radius: 6px;
          white-space: nowrap;
        }

        .card-content h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 4px;
          color: var(--primary-color);
        }

        .card-content p {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .btn-more {
          margin-left: auto;
          color: #CBD5E1;
          background: transparent;
        }

        @media (max-width: 640px) {
          .trip-dest {
            font-size: 1.8rem;
          }
          .trip-meta {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default ScheduleView;
