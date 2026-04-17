import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Plus, Trash2, Sparkles, ShoppingBag, Luggage, Briefcase, Camera } from 'lucide-react';

/**
 * PackingList Page - AI-powered trip packing assistant.
 */
const PackingList = ({ tripData, onBack, onSaveTrip, isEmbedded }) => {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize items from tripData if they exist
  useEffect(() => {
    if (tripData?.packingList) {
      setItems(tripData.packingList);
    }
  }, [tripData]);

  const handleAddItem = (e) => {
    if (e) e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem = {
      id: `item-${Date.now()}`,
      text: newItemText,
      checked: false,
      category: '기타'
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setNewItemText('');
    savePackingList(updatedItems);
  };

  const toggleItem = (id) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    savePackingList(updatedItems);
  };

  const deleteItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    savePackingList(updatedItems);
  };

  const savePackingList = (updatedItems) => {
    if (onSaveTrip) {
      onSaveTrip({
        ...tripData,
        packingList: updatedItems
      });
    }
  };

  const generateAIPackingList = async () => {
    setIsGenerating(true);
    
    // Simulate AI logic based on trip data
    setTimeout(() => {
      const destination = (tripData?.destination || '').toLowerCase();
      const style = tripData?.style || 'nature';
      
      const baseItems = [
        { id: `ai-${Date.now()}-1`, text: '여권 및 신분증', checked: false, category: '필수' },
        { id: `ai-${Date.now()}-2`, text: '보조 배터리', checked: false, category: '전자기기' },
        { id: `ai-${Date.now()}-3`, text: '세면도구 세트', checked: false, category: '위생' },
        { id: `ai-${Date.now()}-4`, text: '멀티 어댑터', checked: false, category: '전자기기' },
      ];

      const additionalItems = [];

      // Destination-based logic
      if (destination.includes('제주') || destination.includes('부산') || destination.includes('해변')) {
        additionalItems.push({ id: `ai-${Date.now()}-5`, text: '선글라스 & 선크림', checked: false, category: '위생' });
        additionalItems.push({ id: `ai-${Date.now()}-6`, text: '비치타월 또는 여벌 옷', checked: false, category: '의류' });
      } else if (destination.includes('일본') || destination.includes('도쿄') || destination.includes('오사카')) {
        additionalItems.push({ id: `ai-${Date.now()}-5`, text: '포켓 와이파이 / eSIM', checked: false, category: '전자기기' });
        additionalItems.push({ id: `ai-${Date.now()}-6`, text: '동전 지갑', checked: false, category: '필수' });
      } else if (destination.includes('유럽') || destination.includes('파리') || destination.includes('런던')) {
        additionalItems.push({ id: `ai-${Date.now()}-5`, text: '편한 걷기용 신발', checked: false, category: '의류' });
        additionalItems.push({ id: `ai-${Date.now()}-6`, text: '소매치기 방지용 가방', checked: false, category: '필수' });
      }

      // Style-based logic
      if (style === 'food') {
        additionalItems.push({ id: `ai-${Date.now()}-7`, text: '소화제', checked: false, category: '위생' });
      } else if (style === 'activity') {
        additionalItems.push({ id: `ai-${Date.now()}-7`, text: '액션캠 또는 고프로', checked: false, category: '전자기기' });
        additionalItems.push({ id: `ai-${Date.now()}-8`, text: '스포츠 타월', checked: false, category: '위생' });
      } else if (style === 'shopping') {
        additionalItems.push({ id: `ai-${Date.now()}-7`, text: '접이식 보조 가방', checked: false, category: '의류' });
      }

      const allItems = [...baseItems, ...additionalItems];
      setItems(allItems);
      savePackingList(allItems);
      setIsGenerating(false);
    }, 1500);
  };

  const categories = ['필수', '의류', '전자기기', '위생', '기타'];

  return (
    <div className="packing-page">
      <div className={`container ${isEmbedded ? '' : 'py-12 max-w-2xl'}`}>
        {!isEmbedded && (
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="btn-back-light mb-8" 
            onClick={onBack}
          >
            <ArrowLeft size={18} /> 일정으로 돌아가기
          </motion.button>
        )}

        <header className={`page-header ${isEmbedded ? 'mb-6' : 'mb-10'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={`${isEmbedded ? 'embedded-title' : 'page-title'}`}>
              <span className="icon-badge"><Luggage size={isEmbedded ? 20 : 28} /></span> 
              <span>{tripData?.destination} <span className="text-secondary">챙길 물건</span></span>
            </h1>
            {!isEmbedded && (
              <p className="page-subtitle">
                "설레는 마음만 가져가세요. 짐은 AI가 챙겨드릴게요."
              </p>
            )}
          </motion.div>
        </header>

        <section className="packing-controls">
          <form onSubmit={handleAddItem} className="add-form">
            <input 
              type="text" 
              placeholder="무엇을 더 챙겨야 할까요?" 
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="add-input"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              className="btn-add"
            >
              <Plus size={24} />
            </motion.button>
          </form>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`btn-ai ${isGenerating ? 'loading' : ''}`}
            onClick={generateAIPackingList}
            disabled={isGenerating}
          >
            <Sparkles size={18} /> {isGenerating ? 'AI가 고민 중...' : 'AI 추천 받기'}
          </motion.button>
        </section>

        <div className="items-list">
          {categories.map(category => {
            const categoryItems = items.filter(item => item.category === category);
            if (categoryItems.length === 0 && category !== '기타') return null;
            if (category === '기타' && categoryItems.length === 0 && items.length > 0) return null;

            return (
              <div key={category} className="category-section">
                <h3 className="category-title">
                  {category === '필수' && <Check size={18} className="icon-green" />}
                  {category === '의류' && <ShoppingBag size={18} className="icon-blue" />}
                  {category === '전자기기' && <Camera size={18} className="icon-purple" />}
                  {category === '위생' && <Briefcase size={18} className="icon-red" />}
                  {category}
                </h3>
                <div className="items-grid">
                  <AnimatePresence>
                    {categoryItems.map(item => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`item-card ${item.checked ? 'checked' : ''}`}
                      >
                        <button 
                          className={`check-circle ${item.checked ? 'active' : ''}`}
                          onClick={() => toggleItem(item.id)}
                        >
                          {item.checked && <Check size={14} />}
                        </button>
                        <span className="item-text">{item.text}</span>
                        <button className="btn-delete" onClick={() => deleteItem(item.id)}>
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {categoryItems.length === 0 && items.length === 0 && (
                    <div className="empty-state">
                      준비물을 추가하거나 AI 추천을 받아보세요.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .packing-page {
          min-height: ${isEmbedded ? 'auto' : '100vh'};
          background-color: ${isEmbedded ? 'transparent' : 'var(--bg-light)'};
          color: var(--text-main);
        }

        .text-secondary {
          color: var(--secondary-color);
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

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 8px;
        }

        .page-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
          font-style: italic;
          margin-top: 12px;
        }

        .embedded-title {
          font-size: 1.5rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .packing-controls {
          display: flex;
          gap: 16px;
          margin-bottom: 40px;
        }

        .add-form {
          flex: 1;
          display: flex;
          gap: 12px;
        }

        .icon-badge {
          background: var(--white);
          padding: 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
          color: var(--secondary-color);
          border: 1px solid rgba(255, 154, 60, 0.1);
        }

        .add-input {
          flex: 1;
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 14px 20px;
          font-size: 1.1rem;
          outline: none;
          transition: all 0.2s;
        }

        .add-input:focus {
          border-color: var(--secondary-color);
          box-shadow: 0 0 0 4px rgba(255, 154, 60, 0.1);
        }

        .btn-add {
          background: var(--primary-color);
          color: white;
          width: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .btn-ai {
          background: linear-gradient(135deg, #1E3A5F 0%, #3B82F6 100%);
          color: white;
          padding: 0 24px;
          border-radius: 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(30, 58, 95, 0.2);
          white-space: nowrap;
        }

        .btn-ai:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(30, 58, 95, 0.3);
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .category-title {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--primary-color);
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid #F1F5F9;
        }

        .icon-green { color: #10B981; }
        .icon-blue { color: #3B82F6; }
        .icon-purple { color: #8B5CF6; }
        .icon-red { color: #EF4444; }

        .items-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .item-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: white;
          border: 1px solid #F1F5F9;
          border-radius: 16px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .item-card:hover {
          border-color: var(--secondary-color);
          transform: translateX(6px);
          box-shadow: var(--shadow-sm);
        }

        .item-card.checked {
          background: #F8FAFC;
          opacity: 0.6;
        }

        .item-card.checked .item-text {
          text-decoration: line-through;
          color: #94A3B8;
        }

        .check-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: white;
          background: white;
        }

        .check-circle.active {
          background: var(--secondary-color);
          border-color: var(--secondary-color);
        }

        .item-text {
          flex: 1;
          font-weight: 500;
          font-size: 1.1rem;
          color: var(--text-main);
        }

        .btn-delete {
          color: #CBD5E1;
          background: transparent;
          padding: 4px;
          transition: color 0.2s;
        }

        .btn-delete:hover {
          color: #EF4444;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: var(--text-muted);
          font-style: italic;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          border: 2px dashed #E2E8F0;
        }

        @media (max-width: 640px) {
          .page-title { font-size: 1.8rem; }
          .packing-controls {
            flex-direction: column;
          }
          .btn-ai {
            height: 52px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default PackingList;
