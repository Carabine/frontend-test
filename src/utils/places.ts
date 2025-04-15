import type { Person } from '@/store/placesStore';

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers

  // Convert degrees to radians
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

  // Haversine formula
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// [Consider] We can get out of Person interface for reusability
export const findClosestPeople = (people: Person[], placeCoordinates: [number, number], maxClosest: number = 3): Person[] => {
  const distances = people.map(person => {
    const lat = parseFloat(person.address.geo.lat);
    const lng = parseFloat(person.address.geo.lng);
    const distance = getDistance(placeCoordinates[0], placeCoordinates[1], lat, lng);
    return { ...person, distance };
  });

  const sortedDistances = distances.sort((a, b) => a.distance - b.distance);

  return sortedDistances.map((person, index) => ({
    ...person,
    isClosest: index < maxClosest
  }));
};
