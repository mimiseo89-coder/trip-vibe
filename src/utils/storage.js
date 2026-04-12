/**
 * Storage utility for TripMate AI.
 * Handles persistence of generated trips using localStorage.
 */

const STORAGE_KEY = 'tripmate_saved_trips';

/**
 * Save a trip to localStorage.
 * If the trip already exists (by ID), it updates it.
 */
export const saveTrip = (tripData) => {
  try {
    const existingTrips = getSavedTrips();
    const index = existingTrips.findIndex(t => t.id === tripData.id);
    
    if (index > -1) {
      existingTrips[index] = tripData;
    } else {
      existingTrips.push(tripData);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTrips));
    return true;
  } catch (error) {
    console.error('Error saving trip:', error);
    return false;
  }
};

/**
 * Retrieve all saved trips from localStorage.
 */
export const getSavedTrips = () => {
  try {
    const trips = localStorage.getItem(STORAGE_KEY);
    return trips ? JSON.parse(trips) : [];
  } catch (error) {
    console.error('Error retrieving trips:', error);
    return [];
  }
};

/**
 * Delete a specific trip by ID.
 */
export const deleteTrip = (tripId) => {
  try {
    const existingTrips = getSavedTrips();
    const updatedTrips = existingTrips.filter(t => t.id !== tripId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    return true;
  } catch (error) {
    console.error('Error deleting trip:', error);
    return false;
  }
};

/**
 * Get a single trip by ID.
 */
export const getTripById = (tripId) => {
  const trips = getSavedTrips();
  return trips.find(t => t.id === tripId) || null;
};
