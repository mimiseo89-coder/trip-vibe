import { GoogleGenerativeAI } from "@google/generative-ai";

// API 키는 환경 변수(VITE_GEMINI_API_KEY)로 관리하거나 직접 입력하세요.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * AI를 사용하여 여행 일정을 생성합니다.
 * @param {Object} tripData - 여행 목적지, 날짜, 스타일 등
 * @returns {Promise<Array>} 날짜별 장소 리스트
 */
export const generateAISchedule = async (tripData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `[${tripData.destination}]의 [${tripData.startDate} ~ ${tripData.endDate}] 여행 일정을 짜줘. 
참고로 사용자의 여행 스타일은 [${tripData.style}]이야.
반드시 아래 조건을 지켜줘:
- 모든 장소는 반드시 구글 지도에서 검색이 가능한 '실제의 구체적인 고유 명칭'으로만 작성할 것.
- 각 날짜(day)별로 서로 겹치지 않는 다양한 장소들로 알차게 구성할 것.
- 절대 '유명 맛집', '야경 명소', '현지 시장' 같은 추상적인 카테고리 표현은 제목(place_name)에 쓰지 말 것.
- 각 장소마다 다음 정보를 JSON 필드에 포함할 것:
  - place_name: 실제 장소명 (현지어 명칭 + 한국어 병기)
  - category: 맛집 / 관광 / 쇼핑 / 액티비티 중 하나
  - description: 이 장소를 추천하는 이유를 사용자 취향에 맞춰 1~2문장으로 설명
  - time_slot: 오전 / 오후 / 저녁 중 하나
  - duration: 예상 소요 시간 (예: 1시간 30분)
- 출력은 반드시 아래 예시와 같은 순수한 JSON 배열 형식으로만 반환할 것. (텍스트 설명 없이 JSON만):
  [
    {
      "day": 1,
      "date": "2024-04-10",
      "places": [
        {
          "place_name": "...", 
          "category": "...",
          "description": "...",
          "time_slot": "...",
          "duration": "..."
        }
      ]
    }
  ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSON 추출 (Markdown 코드 블록 제거 등)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Could not parse JSON from AI response");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("AI Schedule Generation Error:", error);
    throw error;
  }
};

/**
 * 사용자의 추가 요청에 따라 일정을 수정하거나 재생성합니다.
 * @param {Array} currentSchedule - 현재 일정
 * @param {Object} tripData - 여행 기본 정보
 * @param {string} request - 수정 요청 사항
 * @returns {Promise<Array>} 수정된 날짜별 장소 리스트
 */
export const updateAISchedule = async (currentSchedule, tripData, request) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `기존의 [${tripData.destination}] 여행 일정에서 다음 요청사항을 반영하여 일정을 수정해줘:
요청사항: "${request}"

기존 일정:
${JSON.stringify(currentSchedule)}

반드시 아래 조건을 지켜줘:
- 사용자의 요청을 최우선으로 반영할 것 (예: 맛집 위주로 바꿔달라면 맛집 비중을 높일 것).
- 모든 장소는 반드시 구글 지도에서 검색이 가능한 '실제의 구체적인 고유 명칭'으로만 작성할 것.
- 출력 형식과 필드는 기존 일정의 JSON 구조를 완벽하게 유지할 것.
- 출력은 반드시 본문 없이 순수한 JSON 배열 형식으로만 반환할 것.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Could not parse JSON from AI response");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("AI Schedule Update Error:", error);
    throw error;
  }
};
