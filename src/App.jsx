import React, { useState } from 'react'
import Home from './pages/Home'
import CreateTrip from './pages/CreateTrip'
import ScheduleView from './pages/ScheduleView'
import PackingList from './pages/PackingList'

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
  };

  const handleViewTrip = (savedTrip) => {
    setTripData(savedTrip);
    navigateTo('schedule');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onStart={handleStartTrip} onViewTrip={handleViewTrip} />;
      case 'create':
        return <CreateTrip onBack={() => navigateTo('home')} onSubmit={handleFormSubmit} />;
      case 'schedule':
        return <ScheduleView tripData={tripData} onBack={() => navigateTo('home')} onGoToPacking={() => navigateTo('packing')} />;
      case 'packing':
        return <PackingList tripData={tripData} onBack={() => navigateTo('schedule')} onSaveTrip={(data) => setTripData(data)} />;
      default:
        return <Home onStart={handleStartTrip} onViewTrip={handleViewTrip} />;
    }
  };

  return (
    <div className="app-layout">
      {renderPage()}
    </div>
  );
}

export default App;

