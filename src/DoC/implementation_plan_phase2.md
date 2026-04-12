# Phase 2 Development Plan: Trip_vibe Enhancement

This plan outlines the steps to implement manual schedule editing, automated packing lists, and local storage for trips, as defined in the Phase 2 PRD.

## 1. Data Structure & Storage Update
To support saving and loading trips, we need a unified data structure and a service to handle `localStorage`.

- **Trip Object Schema:**
  ```json
  {
    "id": "uuid",
    "destination": "Paris",
    "startDate": "2024-06-01",
    "endDate": "2024-06-05",
    "style": "Gourmet",
    "itinerary": [
      {
        "day": 1,
        "places": [
          { "id": "p1", "name": "Eiffel Tower", "memo": "", "time": "10:00" }
        ]
      }
    ],
    "packingList": [
      { "id": "item1", "text": "Passport", "checked": false }
    ]
  }
  ```
- **Storage Utility:** Create `src/utils/storage.js` to manage saving/retrieving the list of trips.

## 2. Feature: Saving & Loading (Home Screen)
- **Home.jsx Update:**
  - Load trips from `localStorage`.
  - Display trip cards with destination, dates, and calculated D-day.
  - Add a "Delete" option for saved trips.
- **Save Trigger:** Add a "Save Trip" button in `ScheduleView.jsx`.

## 3. Feature: Manual Schedule Editing
- **Delete Place:** Add a delete icon/button to each place card in `ScheduleView.jsx`.
- **Drag & Drop:** Integrate `dnd-kit` or `react-beautiful-dnd` to allow reordering of places within a day.
- **Memos:** Add a text area or input field to each place card that syncs with the trip state.

## 4. Feature: AI Packing List (Page 4)
- **New Page:** `PackingList.jsx`.
- **AI Integration:** 
  - Send trip destination, season (derived from date), and style to Gemini.
  - Prompt: "Based on [Destination] in [Season] for a [Style] trip, recommend 10 essential packing items."
  - Parse response into a checklist.
- **State Management:** Save checklist state within the trip object.

## 5. Technical Requirements
- **State management:** Use `useState`/`useEffect` and potentially `useContext` if the trip data needs to be shared widely.
- **Libraries:**
  - `date-fns` for D-day calculations.
  - `uuid` for unique trip/place IDs.

## Next Steps
1.  **Step 1:** Implement `storage.js` and update `Home.jsx` to show saved trips.
2.  **Step 2:** Update `ScheduleView.jsx` to allow modifications (Delete, Memo).
3.  **Step 3:** Implement Drag & Drop in `ScheduleView.jsx`.
4.  **Step 4:** Create `PackingList.jsx` and integrate AI recommendation.
5.  **Step 5:** Final polish and D-day UI.
