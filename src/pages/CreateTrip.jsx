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
      <div className="container min-h-screen py-10">
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="btn-back"
          onClick={onBack}
        >
          <ArrowLeft size={20} /> 돌아가기
        </motion.button>

        <div className="form-container glass p-8 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="form-header"
          >
            <h2 className="section-title">어디로, 어떤 여행을<br /><span>떠나고 싶으신가요?</span></h2>
            <p className="section-subtitle">AI가 당신의 취향에 딱 맞는 일정을 설계해 드립니다.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="trip-form">
            {/* Destination */}
            <div className="form-group">
              <label><MapPin size={18} /> 여행지</label>
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
                <label><CalendarIcon size={18} /> 출발일</label>
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
                <label><CalendarIcon size={18} /> 도착일</label>
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
              <label><Users size={18} /> 여행 인원 (명)</label>
              <input 
                type="number" 
                name="travelers"
                min="1"
                max="20"
                value={formData.travelers}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Style Selection */}
            <div className="form-group">
              <label><Sparkles size={18} /> 여행 스타일</label>
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
              AI 일정 생성하기 <ArrowRight size={20} />
            </motion.button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .create-trip-page {
          background: linear-gradient(135deg, #1E3A5F 0%, #0F172A 100%);
          min-height: 100vh;
          color: white;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.9rem;
        }

        .form-container {
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          border-radius: 24px;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .section-title span {
          color: var(--secondary-color);
        }

        .section-subtitle {
          opacity: 0.7;
          margin-bottom: 2.5rem;
        }

        .trip-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          opacity: 0.9;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .input-field {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          font-size: 1rem;
          transition: var(--transition-smooth);
        }

        .input-field:focus {
          border-color: var(--secondary-color);
          background: rgba(255, 255, 255, 0.1);
          outline: none;
        }

        .style-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
        }

        .style-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.6);
          transition: var(--transition-smooth);
        }

        .style-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .style-btn.active {
          background: var(--secondary-color);
          color: white;
          border-color: var(--secondary-color);
          box-shadow: 0 4px 12px rgba(255, 154, 60, 0.3);
        }

        .style-icon {
          font-size: 1.5rem;
        }

        .style-label {
          font-size: 0.8rem;
          font-weight: 600;
        }

        .btn-submit {
          background: var(--secondary-color);
          color: white;
          padding: 16px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
          box-shadow: 0 10px 20px rgba(255, 154, 60, 0.2);
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 1.6rem;
          }
          .form-row {
            grid-template-columns: 1fr;
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
