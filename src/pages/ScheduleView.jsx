import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowLeft, Trash2, Edit3, Save, Sparkles, Plus, Luggage, Loader2 } from 'lucide-react';
import { saveTrip } from '../utils/storage';
import { generateAISchedule } from '../utils/ai';

/**
 * ScheduleView - Displays and allows editing of the AI-generated itinerary.
 */
const ScheduleView = ({ tripData, onBack, onGoToPacking }) => {
  const [localSchedule, setLocalSchedule] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize schedule
  useEffect(() => {
    const initSchedule = async () => {
      if (tripData?.itinerary) {
        setLocalSchedule(tripData.itinerary);
        setIsSaved(true);
      } else {
        setIsGenerating(true);
        try {
          // Try to generate actual AI schedule
          const generated = await generateAISchedule(tripData);
          setLocalSchedule(generated);
          setIsSaved(false);
        } catch (error) {
          console.error("AI Generation failed, falling back to demo:", error);
          
          const start = new Date(tripData?.startDate || new Date());
          const end = new Date(tripData?.endDate || new Date());
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

          // Realistic mock data generator for testing purposes
          const getMockPlaces = (dest, day) => {
            const isTokyo = dest?.toLowerCase().includes('도쿄') || dest?.toLowerCase().includes('tokyo');
            const isParis = dest?.toLowerCase().includes('파리') || dest?.toLowerCase().includes('paris');
            
            if (isTokyo) {
              const tokyoMocks = [
                [
                  { place_name: 'Narita International Airport (나리타 국제공항)', category: '관광', description: '도쿄 성장의 상징이자 여행의 시작점입니다.', time_slot: '오후', duration: '1시간 30분' },
                  { place_name: 'Shinjuku Golden Gai (신주쿠 골든가이)', category: '맛집', description: '좁은 골목에 위치한 아기자기한 바들이 밀집한 심야 명소입니다.', time_slot: '저녁', duration: '2시간' }
                ],
                [
                  { place_name: 'Tsukiji Outer Market (츠키지 장외시장)', category: '맛집', description: '신선한 스시와 다양한 해산물 요리를 즐길 수 있습니다.', time_slot: '오전', duration: '2시간 30분' },
                  { place_name: 'Shibuya Sky (시부야 스카이)', category: '관광', description: '시부야의 탁 트인 전경과 스크램블 교차로를 내려다볼 수 있습니다.', time_slot: '오후', duration: '2시간' }
                ],
                [
                  { place_name: 'Senso-ji Temple (센소지)', category: '관광', description: '아사쿠사에 위치한 도쿄에서 가장 오래된 고풍스러운 사찰입니다.', time_slot: '오전', duration: '1시간 30분' },
                  { place_name: 'Ginza Mitsukoshi (긴자 미츠코시)', category: '쇼핑', description: '도쿄의 세련된 쇼핑 문화를 경험할 수 있는 백화점입니다.', time_slot: '오후', duration: '2시간' }
                ]
              ];
              return tokyoMocks[day % tokyoMocks.length];
            } else if (isParis) {
              const parisMocks = [
                [
                  { place_name: 'Eiffel Tower (에펠탑)', category: '관광', description: '프랑스의 상징적인 구조물로 야경이 특히 아름답습니다.', time_slot: '저녁', duration: '2시간' },
                  { place_name: 'Le Comptoir du Relais (르 꽁쁘뚜아르 뒤 흘레)', category: '맛집', description: '현지인들이 사랑하는 정통 프렌치 비스트로입니다.', time_slot: '오후', duration: '1시간 30분' }
                ],
                [
                  { place_name: 'Louvre Museum (루브르 박물관)', category: '관광', description: '세계 최대 규모의 박물관에서 예술의 진수를 느껴보세요.', time_slot: '오전', duration: '3시간' },
                  { place_name: 'Angelina Paris (안젤리나 파리)', category: '맛집', description: '고급스러운 핫초코와 몽블랑 디저트로 유명한 유서 깊은 카페입니다.', time_slot: '오후', duration: '1시간' }
                ],
                [
                  { place_name: 'Arc de Triomphe (개선문)', category: '관광', description: '샹젤리제 거리 끝에 서서 파리의 역사를 감상하세요.', time_slot: '오후', duration: '1시간' },
                  { place_name: 'Champs-Élysées (샹젤리제 거리)', category: '쇼핑', description: '세련된 브랜드와 아름다운 가로수가 어우러진 거리입니다.', time_slot: '저녁', duration: '2시간' }
                ]
              ];
              return parisMocks[day % parisMocks.length];
            } else {
              // Generic but unique per day
              const genericMocks = [
                [
                  { place_name: `Local Famous Landmark (현지 랜드마크)`, category: '관광', description: '이 지역에서 반드시 방문해야 할 필수 코스입니다.', time_slot: '오전', duration: '2시간' },
                  { place_name: `Traditional Market (지역 전통 시장)`, category: '쇼핑', description: '현지의 정취를 가장 잘 느낄 수 있는 곳입니다.', time_slot: '오후', duration: '1시간 30분' }
                ],
                [
                  { place_name: `Hidden Cafe (숨겨진 현지 카페)`, category: '맛집', description: '조용하고 분위기 좋은 곳에서 잠시 쉬어가세요.', time_slot: '오후', duration: '1시간' },
                  { place_name: `City Park (도심 공원 산책)`, category: '관광', description: '여유롭게 자연을 즐기며 힐링하는 시간입니다.', time_slot: '저녁', duration: '1시간 30분' }
                ],
                [
                  { place_name: `Art Gallery or Museum (미술관/박물관)`, category: '문화', description: '이 지역의 예술과 문화를 깊이 있게 이해하는 시간입니다.', time_slot: '오전', duration: '2시간' },
                  { place_name: `Sunset View Point (일출/일몰 명소)`, category: '관광', description: '하루를 마무리하며 멋진 풍경을 감상하세요.', time_slot: '저녁', duration: '1시간' }
                ]
              ];
              return genericMocks[day % genericMocks.length];
            }
          };

          const fallback = Array.from({ length: diffDays }, (_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            const mockPlaces = getMockPlaces(tripData?.destination, i);
            
            return {
              day: i + 1,
              date: date.toISOString().split('T')[0],
              places: mockPlaces.map((p, idx) => ({ ...p, id: `mocked-${i}-${idx}`, memo: '' }))
            };
          });
          setLocalSchedule(fallback);
        } finally {
          setIsGenerating(false);
        }
      }
    };

    initSchedule();
  }, [tripData]);

  const handleSave = () => {
    const tripToSave = {
      ...tripData,
      id: tripData.id || `trip-${Date.now()}`,
      itinerary: localSchedule,
      updatedAt: new Date().toISOString()
    };
    
    const success = saveTrip(tripToSave);
    if (success) {
      setIsSaved(true);
      alert('여행 일정이 저장되었습니다!');
    }
  };

  const handleDeletePlace = (dayIndex, placeId) => {
    const updated = [...localSchedule];
    updated[dayIndex].places = updated[dayIndex].places.filter(p => p.id !== placeId);
    setLocalSchedule(updated);
    setIsSaved(false);
  };

  const handleUpdateMemo = (dayIndex, placeId, memo) => {
    const updated = [...localSchedule];
    const place = updated[dayIndex].places.find(p => p.id === placeId);
    if (place) {
      place.memo = memo;
      setLocalSchedule(updated);
      setIsSaved(false);
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case '맛집': return { label: '맛집', emoji: '🍜', class: 'cat-food' };
      case '관광': return { label: '관광', emoji: '🏛️', class: 'cat-sight' };
      case '쇼핑': return { label: '쇼핑', emoji: '🛍️', class: 'cat-shop' };
      case '액티비티': return { label: '액티비티', emoji: '🎯', class: 'cat-act' };
      default: return { label: '기타', emoji: '📍', class: 'cat-etc' };
    }
  };


  return (
    <div className="schedule-page">
      <div className="container py-8">
        <header className="schedule-header">
          <div className="flex-between">
            <button className="btn-back-light" onClick={onBack}>
              <ArrowLeft size={18} /> {tripData?.itinerary ? '목록으로' : '이전으로'}
            </button>
            <div className="header-actions">
              <button className="btn-packing" onClick={onGoToPacking}>
                <Luggage size={18} /> 짐싸기 체크리스트
              </button>
              <button 
                className={`btn-save ${isSaved ? 'saved' : ''}`} 
                onClick={handleSave}
                disabled={isSaved && tripData?.itinerary}
              >
                {isSaved ? <><Save size={18} /> 저장됨</> : <><Save size={18} /> 일정 저장하기</>}
              </button>
            </div>
          </div>
          
          <div className="trip-summary mt-6">
            <h1 className="trip-dest">{tripData?.destination || '여행지'}</h1>
            <div className="trip-meta">
              <span><Calendar size={14} /> {tripData?.startDate} ~ {tripData?.endDate}</span>
              <span><Sparkles size={14} /> {tripData?.style} 스타일</span>
            </div>
          </div>
        </header>

        <section className="itinerary mt-10">
          {isGenerating ? (
            <div className="generating-state">
              <Loader2 size={40} className="animate-spin" />
              <p>AI가 완벽한 일정을 짜고 있습니다...</p>
              <span>{tripData?.destination}의 숨은 명소를 찾는 중이에요.</span>
            </div>
          ) : (
            <>
              <div className="ai-badge">
                <Sparkles size={14} /> AI가 추천하는 최적의 일정입니다
              </div>

              <div className="timeline-container">
                {localSchedule.map((day, dayIdx) => (
                  <div key={day.day} className="day-section">
                    <div className="day-indicator">
                      <span className="day-num">Day {day.day}</span>
                      <span className="day-date">{day.date}</span>
                    </div>

                    <div className="day-cards">
                      {day.places.map((place, idx) => {
                        const cat = getCategoryBadge(place.category);
                        return (
                          <motion.div 
                            key={place.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="place-card glass"
                          >
                            <div className="card-top">
                              <div className="card-time">
                                <Clock size={12} /> {place.time_slot || '시간대'}
                              </div>
                              {place.duration && (
                                <div className="card-duration">
                                  <Calendar size={12} /> {place.duration}
                                </div>
                              )}
                              <span className={`cat-badge ${cat.class}`}>
                                {cat.emoji} {cat.label}
                              </span>
                            </div>

                            <div className="card-content">
                              <h3>{place.place_name || place.name}</h3>
                              <p className="place-desc">{place.description || place.reason}</p>
                              
                              <div className="memo-area mt-4">
                                <Edit3 size={12} className="memo-icon" />
                                <input 
                                  type="text" 
                                  placeholder="나만의 메모를 남겨보세요..." 
                                  value={place.memo || ''} 
                                  onChange={(e) => handleUpdateMemo(dayIdx, place.id, e.target.value)}
                                  className="memo-input"
                                />
                              </div>
                            </div>
                            <button 
                              className="btn-delete-place"
                              onClick={() => handleDeletePlace(dayIdx, place.id)}
                              title="장소 삭제"
                            >
                              <Trash2 size={18} />
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <style>{`
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

        .header-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .btn-packing {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid var(--secondary-color);
          color: var(--secondary-color);
          padding: 8px 18px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .btn-packing:hover {
          background: rgba(255, 154, 60, 0.05);
          transform: translateY(-2px);
        }

        .flex-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-save {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--secondary-color);
          color: white;
          padding: 8px 18px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .btn-save:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 154, 60, 0.3);
        }

        .btn-save.saved {
          background: #10B981;
        }

        .btn-save:disabled {
          opacity: 0.8;
          cursor: default;
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

        .generating-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
          color: var(--text-muted);
        }

        .generating-state p {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-top: 16px;
          margin-bottom: 8px;
        }

        .generating-state span {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
          color: var(--secondary-color);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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

        .card-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .card-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--secondary-color);
          background: rgba(255, 154, 60, 0.08);
          padding: 4px 10px;
          border-radius: 6px;
          white-space: nowrap;
        }

        .card-duration {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #64748B;
          background: #F1F5F9;
          padding: 4px 10px;
          border-radius: 6px;
          white-space: nowrap;
        }

        .cat-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cat-food { background: #FEF2F2; color: #EF4444; }
        .cat-sight { background: #F0F9FF; color: #0EA5E9; }
        .cat-shop { background: #FAF5FF; color: #A855F7; }
        .cat-act { background: #ECFDF5; color: #10B981; }
        .cat-etc { background: #F8FAFC; color: #64748B; }

        .card-content {
          flex: 1;
        }

        .card-content h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 6px;
          color: var(--primary-color);
        }

        .place-desc {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.5;
        }

        .btn-delete-place {
          align-self: flex-start;
          color: #CBD5E1;
          background: transparent;
          transition: all 0.2s ease;
          padding: 8px;
          border-radius: 8px;
        }

        .btn-delete-place:hover {
          color: #ff3b30;
          background: rgba(255, 59, 48, 0.05);
        }

        .memo-area {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F8FAFC;
          padding: 8px 12px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
        }

        .memo-icon {
          color: #94A3B8;
        }

        .memo-input {
          border: none;
          background: transparent;
          font-size: 0.9rem;
          color: var(--text-main);
          width: 100%;
          outline: none;
        }

        .memo-input::placeholder {
          color: #CBD5E1;
        }

        @media (max-width: 640px) {
          .trip-dest {
            font-size: 1.8rem;
          }
          .trip-meta {
            flex-direction: column;
            gap: 4px;
          }
          .flex-between {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .btn-save {
            width: 100%;
            justify-content: center;
          }
          .card-top {
            gap: 6px;
          }
        }

      `}</style>
    </div>
  );
};

export default ScheduleView;
