import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar as CalendarIcon, Users, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * CreateTrip Page - Form for gathering trip details.
 * Supports location, dates, group size, and travel style.
 */
const CreateTrip = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    style: 'nature' // nature, food, culture, activity, shopping
  });

  const styles = [
    { id: 'nature', label: '휴양/자연', icon: '🌴' },
    { id: 'food', label: '맛집/카페', icon: '🍱' },
    { id: 'culture', label: '문화/예술', icon: '🎨' },
    { id: 'activity', label: '액티비티', icon: '🧗' },
    { id: 'shopping', label: '쇼핑', icon: '🛍️' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStyleSelect = (id) => {
    setFormData(prev => ({ ...prev, style: id }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="create-trip-page">
      <div className="create-trip-container">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="btn-back"
          onClick={onBack}
        >
          <ArrowLeft size={18} /> 이전으로
        </motion.button>

        <div className="form-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="form-header"
          >
            <h2 className="section-title">어디로, 어떤 여행을<br /><span>떠나고 싶으신가요?</span></h2>
            <p className="section-subtitle">AI가 당신의 취향에 딱 맞는 일정을 설계해 드립니다.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="trip-form">
            {/* Destination */}
            <div className="form-group">
              <label><MapPin size={20} /> 여행지</label>
              <input 
                type="text" 
                name="destination"
                placeholder="예: 제주도, 도쿄, 파리"
                value={formData.destination}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div className="form-row">
              {/* Dates */}
              <div className="form-group">
                <label><CalendarIcon size={20} /> 출발일</label>
                <input 
                  type="date" 
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label><CalendarIcon size={20} /> 도착일</label>
                <input 
                  type="date" 
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            {/* Travelers */}
            <div className="form-group">
              <label><Users size={20} /> 여행 인원</label>
              <input 
                type="number" 
                name="travelers"
                min="1"
                max="20"
                value={formData.travelers}
                onChange={handleChange}
                className="input-field"
                placeholder="여행하는 인원수를 입력하세요"
              />
            </div>

            {/* Style Selection */}
            <div className="form-group">
              <label><Sparkles size={20} /> 여행 스타일</label>
              <div className="style-grid">
                {styles.map(style => (
                  <button
                    key={style.id}
                    type="button"
                    className={`style-btn ${formData.style === style.id ? 'active' : ''}`}
                    onClick={() => handleStyleSelect(style.id)}
                  >
                    <span className="style-icon">{style.icon}</span>
                    <span className="style-label">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="btn-submit"
            >
              AI 일정 생성하기 <ArrowRight size={22} />
            </motion.button>
          </form>
        </div>
      </div>

      <style>{`
        .create-trip-page {
          background: linear-gradient(135deg, #FFF5F7 0%, #FFFFFF 100%);
          min-height: 100vh;
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .create-trip-container {
          width: 100%;
          max-width: 650px;
          margin: 0 auto;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--white);
          color: var(--text-main);
          padding: 10px 20px;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 600;
          box-shadow: var(--shadow-sm);
          margin-bottom: 24px;
          border: 1px solid rgba(0,0,0,0.05);
          width: fit-content;
        }

        .form-container {
          background: var(--white);
          border-radius: 32px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.03);
        }

        .form-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .section-title {
          font-family: 'Outfit';
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.2;
          color: #1a1a1a;
        }

        .section-title span {
          color: var(--secondary-color);
          background: linear-gradient(120deg, var(--secondary-color), #FF7043);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .section-subtitle {
          opacity: 0.6;
          font-size: 1.1rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .trip-form {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          font-weight: 700;
          color: #333;
        }

        .form-group label svg {
          color: var(--secondary-color);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .input-field {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 14px 20px;
          color: #1a1a1a;
          font-size: 1.05rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-field:focus {
          border-color: var(--secondary-color);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(255, 154, 60, 0.1);
          outline: none;
        }

        .style-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .style-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 12px;
          background: #F8FAFC;
          border: 2px solid transparent;
          border-radius: 20px;
          color: #64748B;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .style-btn:hover {
          background: #F1F5F9;
          transform: translateY(-2px);
        }

        .style-btn.active {
          background: #FFF7ED;
          color: var(--secondary-color);
          border-color: var(--secondary-color);
          box-shadow: 0 8px 16px rgba(255, 154, 60, 0.15);
        }

        .style-icon {
          font-size: 1.75rem;
        }

        .style-label {
          font-size: 0.85rem;
          font-weight: 700;
        }

        .btn-submit {
          background: linear-gradient(135deg, var(--secondary-color) 0%, #FF7043 100%);
          color: white;
          padding: 18px;
          border-radius: 18px;
          font-size: 1.2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 12px;
          box-shadow: 0 12px 24px rgba(255, 112, 67, 0.3);
          transition: all 0.3s ease;
        }

        .btn-submit:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(255, 112, 67, 0.4);
        }

        @media (max-width: 640px) {
          .create-trip-page {
            padding: 20px 16px;
          }
          .form-container {
            padding: 30px 20px;
            border-radius: 24px;
          }
          .section-title {
            font-size: 1.8rem;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .style-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default CreateTrip;
