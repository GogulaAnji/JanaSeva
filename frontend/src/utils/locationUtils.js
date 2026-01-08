/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees) => {
    return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @param {string} language - Language code (en, te, hi)
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance, language = 'en') => {
    if (distance < 1) {
        const meters = Math.round(distance * 1000);
        const labels = {
            en: 'm away',
            te: 'మీటర్ల దూరంలో',
            hi: 'मीटर दूर'
        };
        return `${meters} ${labels[language] || labels.en}`;
    } else {
        const km = distance.toFixed(1);
        const labels = {
            en: 'km away',
            te: 'కి.మీ దూరంలో',
            hi: 'किमी दूर'
        };
        return `${km} ${labels[language] || labels.en}`;
    }
};

/**
 * Sort workers by distance from user location
 * @param {Array} workers - Array of worker objects
 * @param {Object} userLocation - User's location {latitude, longitude}
 * @returns {Array} Sorted array of workers with distance property
 */
export const sortWorkersByDistance = (workers, userLocation) => {
    if (!userLocation || !workers) return workers;

    return workers
        .map(worker => {
            // Calculate distance if worker has location
            if (worker.user?.location?.coordinates) {
                const [workerLon, workerLat] = worker.user.location.coordinates;
                const distance = calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    workerLat,
                    workerLon
                );
                return { ...worker, distance };
            }
            return { ...worker, distance: null };
        })
        .sort((a, b) => {
            // Workers with location come first, sorted by distance
            if (a.distance === null && b.distance === null) return 0;
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
        });
};

/**
 * Filter workers by location search term
 * @param {Array} workers - Array of worker objects
 * @param {string} locationSearch - Search term for location
 * @returns {Array} Filtered workers
 */
export const filterWorkersByLocation = (workers, locationSearch) => {
    if (!locationSearch || !workers) return workers;

    const searchLower = locationSearch.toLowerCase().trim();

    return workers.filter(worker => {
        const location = worker.user?.location;
        if (!location) return false;

        const district = location.district?.toLowerCase() || '';
        const state = location.state?.toLowerCase() || '';
        const city = location.city?.toLowerCase() || '';
        const pincode = location.pincode?.toString() || '';

        return (
            district.includes(searchLower) ||
            state.includes(searchLower) ||
            city.includes(searchLower) ||
            pincode.includes(searchLower)
        );
    });
};

/**
 * Get location coordinates from address string (placeholder for future geocoding API)
 * @param {string} address - Address string
 * @returns {Promise<Object>} Coordinates {latitude, longitude}
 */
export const geocodeAddress = async (address) => {
    // TODO: Implement with geocoding API (Google Maps, OpenStreetMap, etc.)
    // For now, return null
    console.log('Geocoding not implemented yet:', address);
    return null;
};
