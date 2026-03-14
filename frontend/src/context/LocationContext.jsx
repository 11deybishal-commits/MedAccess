import React, { createContext, useState, useCallback } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: '',
    loading: false,
    error: null,
  });

  const getLocation = useCallback(() => {
    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: '',
          loading: false,
          error: null,
        });
      },
      (error) => {
        setLocation((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const setCustomLocation = useCallback((lat, lng, addr = '') => {
    setLocation({
      latitude: lat,
      longitude: lng,
      address: addr,
      loading: false,
      error: null,
    });
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        getLocation,
        setCustomLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
