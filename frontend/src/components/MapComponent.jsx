import React, { useEffect, useRef } from 'react';
import { initGoogleMaps } from '../services/mapService.js';

const MapComponent = ({ hospitals = [], pharmacies = [], donors = [], center = null }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        await initGoogleMaps();
        
        if (!mapRef.current) return;

        const defaultCenter = center || {
          lat: 28.6139,
          lng: 77.2090,
        };

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          zoom: 13,
          center: defaultCenter,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        // Add user location marker if available
        if (center) {
          new window.google.maps.Marker({
            position: center,
            map: mapInstance.current,
            title: 'Your Location',
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          });
        }

        // Add hospital markers
        hospitals.forEach((hospital) => {
          new window.google.maps.Marker({
            position: { lat: hospital.lat, lng: hospital.lng },
            map: mapInstance.current,
            title: hospital.name,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          });
        });

        // Add pharmacy markers
        pharmacies.forEach((pharmacy) => {
          new window.google.maps.Marker({
            position: { lat: pharmacy.lat, lng: pharmacy.lng },
            map: mapInstance.current,
            title: pharmacy.name,
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          });
        });

        // Add donor markers
        donors.forEach((donor) => {
          if (donor.latitude && donor.longitude) {
            new window.google.maps.Marker({
              position: { lat: donor.latitude, lng: donor.longitude },
              map: mapInstance.current,
              title: `${donor.name} - ${donor.bloodGroup}`,
              icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
            });
          }
        });
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    loadMap();
  }, [hospitals, pharmacies, donors, center]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />
      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md text-sm">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded-full"></div>
            <span>Hospitals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            <span>Pharmacies</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <span>Donors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
