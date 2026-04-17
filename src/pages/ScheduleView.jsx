import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowLeft, Trash2, Edit3, Save, Sparkles, Plus, Luggage, Loader2, Send, Share2, CheckCircle2, Hotel, Ticket, Plane, MessageSquare, ListChecks } from 'lucide-react';
import { saveTrip } from '../utils/storage';
import { generateAISchedule, updateAISchedule } from '../utils/ai';
import PackingList from './PackingList';

/**
 * ScheduleView - Displays and allows editing of the AI-generated itinerary.
 */
const ScheduleView = ({ tripData, onBack, onGoToPacking }) => {
  const [localSchedule, setLocalSchedule] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule', 'reservations', or 'packing'
  const [chatInput, setChatInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [packingList, setPackingList] = useState(tripData?.packingList || []);
  const [reservations, setReservations] = useState(tripData?.reservations || [
    { id: 'res-1', category: '항공', title: '출발 편 명', note: '', isCompleted: false },
    { id: 'res-2', category: '숙소', title: '메인 호텔 예약', note: '', isCompleted: false },
    { id: 'res-3', category: '입장권', title: '명소 입장권', note: '', isCompleted: false }
  ]);

  // Initialize schedule
  useEffect(() => {
    const initSchedule = async () => {
      if (tripData?.itinerary) {
        setLocalSchedule(tripData.itinerary);
        if (tripData.reservations) {
          setReservations(tripData.reservations);
        }
        if (tripData.packingList) {
          setPackingList(tripData.packingList);
        }
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
      reservations: reservations,
      packingList: packingList,
      updatedAt: new Date().toISOString()
    };
    
    const success = saveTrip(tripToSave);
    if (success) {
      setIsSaved(true);
      alert('여행 일정이 저장되었습니다!');
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isUpdating) return;

    const request = chatInput;
    setChatInput('');
    setIsUpdating(true);

    try {
      const updated = await updateAISchedule(localSchedule, tripData, request);
      setLocalSchedule(updated);
      setIsSaved(false);
      alert('일정이 성공적으로 수정되었습니다!');
    } catch (error) {
      console.error("Failed to update schedule:", error);
      alert('일정 수정 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleReservation = (id) => {
    setReservations(prev => prev.map(res => 
      res.id === id ? { ...res, isCompleted: !res.isCompleted } : res
    ));
    setIsSaved(false);
  };

  const updateReservationNote = (id, note) => {
    setReservations(prev => prev.map(res => 
      res.id === id ? { ...res, note } : res
    ));
    setIsSaved(false);
  };

  const addReservation = (category) => {
    const newRes = {
      id: `res-${Date.now()}`,
      category,
      title: `${category} 항목`,
      note: '',
      isCompleted: false
    };
    setReservations(prev => [...prev, newRes]);
    setIsSaved(false);
  };

  const handleShare = (type) => {
    if (type === 'link') {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      alert('여행 링크가 복사되었습니다! (데모버전에서는 현재 URL이 복사됩니다)');
    } else {
      alert('이미지로 저장 기능은 현재 준비 중입니다. 곧 만나보실 수 있어요!');
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

        <section className="tabs mt-6">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <Calendar size={18} /> 일정 타임라인
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
              onClick={() => setActiveTab('reservations')}
            >
              <ListChecks size={18} /> 예약 체크리스트
            </button>
            <button 
              className={`tab-btn ${activeTab === 'packing' ? 'active' : ''}`}
              onClick={() => setActiveTab('packing')}
            >
              <Luggage size={18} /> 짐싸기 체크리스트
            </button>
          </div>
        </section>

        <section className="content-view mt-6">
          {activeTab === 'schedule' ? (
            <div className="itinerary-view">
              {isGenerating ? (
                <div className="generating-state">
                  <Loader2 size={40} className="animate-spin" />
                  <p>AI가 완벽한 일정을 짜고 있습니다...</p>
                  <span>{tripData?.destination}의 숨은 명소를 찾는 중이에요.</span>
                </div>
              ) : (
                <>
                  <div className="flex-between mb-6">
                    <div className="ai-badge">
                      <Sparkles size={14} /> AI가 추천하는 최적의 일정입니다
                    </div>
                    <div className="share-actions">
                      <button className="btn-share-icon" onClick={() => handleShare('link')} title="링크 공유">
                        <Share2 size={18} />
                      </button>
                      <button className="btn-share-icon" onClick={() => handleShare('image')} title="이미지 저장">
                        <Save size={18} />
                      </button>
                    </div>
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
                                key={place.id || `place-${dayIdx}-${idx}`}
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
            </div>
          ) : activeTab === 'reservations' ? (
            <div className="reservations-view">
              <div className="res-header">
                <h2>예약 관리</h2>
                <p>여행에 필요한 예약 항목을 리스트로 관리하세요.</p>
              </div>

              <div className="res-categories mt-6">
                <button className="btn-add-res" onClick={() => addReservation('항공')}>
                  <Plane size={16} /> 항공 추가
                </button>
                <button className="btn-add-res" onClick={() => addReservation('숙소')}>
                  <Hotel size={16} /> 숙소 추가
                </button>
                <button className="btn-add-res" onClick={() => addReservation('입장권')}>
                  <Ticket size={16} /> 입장권 추가
                </button>
              </div>

              <div className="res-list mt-8">
                {reservations.map((res) => (
                  <div key={res.id} className={`res-item glass ${res.isCompleted ? 'completed' : ''}`}>
                    <div className="res-check" onClick={() => toggleReservation(res.id)}>
                      {res.isCompleted ? <CheckCircle2 className="checked" /> : <div className="unchecked" />}
                    </div>
                    <div className="res-info">
                      <div className="res-tag">{res.category}</div>
                      <input 
                        type="text" 
                        className="res-title-input" 
                        value={res.title} 
                        onChange={(e) => {
                          const updated = reservations.map(r => r.id === res.id ? { ...r, title: e.target.value } : r);
                          setReservations(updated);
                          setIsSaved(false);
                        }}
                      />
                      <div className="res-memo-box">
                        <Edit3 size={12} />
                        <input 
                          type="text" 
                          placeholder="예약 번호 또는 메모 입력" 
                          value={res.note} 
                          onChange={(e) => updateReservationNote(res.id, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="packing-view section-view">
              <PackingList 
                tripData={{ ...tripData, packingList }} 
                onSaveTrip={(updatedData) => {
                  setPackingList(updatedData.packingList);
                  setIsSaved(false);
                }}
                isEmbedded={true}
              />
            </div>
          )}
        </section>

        {/* AI Chat Assistant */}
        <div className="ai-chat-bar">
          <div className="chat-content">
            <div className="chat-icon">
              <MessageSquare size={18} />
            </div>
            <input 
              type="text" 
              placeholder='"맛집 위주로 다시 짜줘" 등 요청해보세요' 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isUpdating}
            />
            <button 
              className={`btn-send ${isUpdating ? 'loading' : ''}`}
              onClick={handleSendMessage}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .schedule-page {
          background-color: #F8FAFC;
          min-height: 100vh;
        }

        .schedule-header {
          background: white;
          padding: 24px;
          border-radius: 24px;
          box-shadow: var(--shadow-sm);
          margin-bottom: 24px;
        }

        .trip-dest {
          font-family: 'Outfit';
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--primary-color);
          margin-bottom: 8px;
        }

        .trip-meta {
          display: flex;
          gap: 16px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .trip-meta span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tabs {
          border-bottom: 2px solid #E2E8F0;
          margin-bottom: 32px;
        }

        .tab-buttons {
          display: flex;
          gap: 32px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 4px;
          font-weight: 700;
          color: #94A3B8;
          position: relative;
          background: transparent;
          transition: all 0.2s ease;
          font-size: 1.05rem;
        }

        .tab-btn.active {
          color: var(--primary-color);
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--primary-color);
          border-radius: 10px;
        }

        /* Timeline & Day Section */
        .itinerary-view {
          padding-bottom: 154px;
        }

        .day-section {
          margin-bottom: 48px;
        }

        .day-indicator {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 24px;
          position: sticky;
          top: 20px;
          z-index: 10;
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(8px);
          padding: 8px 0;
        }

        .day-num {
          font-family: 'Outfit';
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--primary-color);
        }

        .day-date {
          font-size: 1rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .day-cards {
          position: relative;
          padding-left: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .day-cards::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #E2E8F0, #E2E8F0 50%, transparent 50%);
          background-size: 2px 12px;
        }

        .place-card {
          position: relative;
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(0,0,0,0.03);
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .place-card::before {
          content: '';
          position: absolute;
          left: -27px;
          top: 30px;
          width: 12px;
          height: 12px;
          background: var(--primary-color);
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 4px rgba(30, 58, 95, 0.1);
        }

        .place-card:hover {
          transform: translateX(8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.06);
          border-color: var(--secondary-color);
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .card-time, .card-duration {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748B;
          background: #F1F5F9;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .cat-badge {
          font-size: 0.8rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .cat-food { background: #FFF7ED; color: #EA580C; }
        .cat-sight { background: #F0F9FF; color: #0284C7; }
        .cat-shop { background: #FAF5FF; color: #9333EA; }
        .cat-act { background: #ECFDF5; color: #059669; }
        .cat-etc { background: #F8FAFC; color: #475569; }

        .card-content h3 {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 8px;
          color: #1a1a1a;
        }

        .place-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #4B5563;
          margin-bottom: 16px;
        }

        .memo-area {
          background: #F8FAFC;
          padding: 12px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px dashed #CBD5E1;
        }

        .memo-icon {
          color: #94A3B8;
        }

        .memo-input {
          border: none;
          background: transparent;
          font-size: 0.9rem;
          width: 100%;
          outline: none;
          color: #1E293B;
          font-weight: 500;
        }

        .btn-delete-place {
          position: absolute;
          top: 20px;
          right: 20px;
          opacity: 0;
          transition: all 0.2s ease;
          color: #94A3B8;
        }

        .place-card:hover .btn-delete-place {
          opacity: 1;
        }

        .btn-delete-place:hover {
          color: #EF4444;
        }

        /* Reservations & Other Styles */
        .res-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .res-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border-radius: 20px;
          background: white;
          border: 1px solid rgba(0,0,0,0.03);
          box-shadow: var(--shadow-sm);
        }

        .unchecked {
          width: 24px;
          height: 24px;
          border-radius: 8px;
          border: 2px solid #CBD5E1;
        }

        .ai-chat-bar {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 40px);
          max-width: 600px;
          background: white;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
          border-radius: 24px;
          padding: 10px;
          z-index: 100;
        }

        .chat-icon {
          background: #EFF6FF;
          color: #2563EB;
          padding: 10px;
          border-radius: 14px;
        }

        .btn-send {
          background: var(--primary-color);
          box-shadow: 0 4px 12px rgba(30, 58, 95, 0.2);
        }

        @media (max-width: 640px) {
          .day-indicator {
            position: relative;
            top: 0;
          }
          .day-cards {
            padding-left: 20px;
          }
          .day-cards::before {
            left: 0;
          }
          .place-card::before {
            left: -37px;
          }
          .trip-dest {
            font-size: 1.8rem;
          }
        }

        .btn-share-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px solid #E2E8F0;
          color: var(--text-muted);
          transition: all 0.2s ease;
        }

        .btn-share-icon:hover {
          border-color: var(--secondary-color);
          color: var(--secondary-color);
          background: rgba(255, 154, 60, 0.05);
        }

        .share-actions {
          display: flex;
          gap: 10px;
        }
      `}</style>
    </div>
  );
};

export default ScheduleView;
