import React, { useState } from 'react'
import Home from './pages/Home'
import CreateTrip from './pages/CreateTrip'
import ScheduleView from './pages/ScheduleView'

/**
 * App - Main controller for the TripMate AI application.
 * Manages the current view (page) and shared trip data.
 */
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [tripData, setTripData] = useState(null);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleStartTrip = () => {
    navigateTo('create');
  };

  const handleFormSubmit = (data) => {
    setTripData(data);
    navigateTo('schedule');
    // Future: In schedule page, trigger Gemini API call with these data.
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onStart={handleStartTrip} />;
      case 'create':
        return <CreateTrip onBack={() => navigateTo('home')} onSubmit={handleFormSubmit} />;
      case 'schedule':
        return <ScheduleView tripData={tripData} onBack={() => navigateTo('create')} />;
      default:
        return <Home onStart={handleStartTrip} />;
    }
  };

  return (
    <div className="app-layout">
      {renderPage()}
    </div>
  );
}

export default App;

