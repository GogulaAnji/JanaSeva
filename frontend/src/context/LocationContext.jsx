import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within LocationProvider');
    }
    return context;
};

export const LocationProvider = ({ children }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [locationPermission, setLocationPermission] = useState('prompt'); // 'granted', 'denied', 'prompt'
    const [locationError, setLocationError] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Load saved location from localStorage on mount
    useEffect(() => {
        const savedLocation = localStorage.getItem('userLocation');
        const savedPermission = localStorage.getItem('locationPermission');

        if (savedLocation) {
            setUserLocation(JSON.parse(savedLocation));
        }
        if (savedPermission) {
            setLocationPermission(savedPermission);
        }
    }, []);

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            return;
        }

        setIsLoadingLocation(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    timestamp: Date.now(),
                };

                setUserLocation(location);
                setLocationPermission('granted');
                setIsLoadingLocation(false);

                // Save to localStorage
                localStorage.setItem('userLocation', JSON.stringify(location));
                localStorage.setItem('locationPermission', 'granted');
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied';
                        setLocationPermission('denied');
                        localStorage.setItem('locationPermission', 'denied');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                    default:
                        errorMessage = 'An unknown error occurred';
                }

                setLocationError(errorMessage);
                setIsLoadingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes
            }
        );
    };

    const clearLocation = () => {
        setUserLocation(null);
        setLocationPermission('prompt');
        localStorage.removeItem('userLocation');
        localStorage.removeItem('locationPermission');
    };

    const value = {
        userLocation,
        locationPermission,
        locationError,
        isLoadingLocation,
        requestLocation,
        clearLocation,
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};
