
import * as XLSX from 'xlsx';

export interface City {
  city: string;
  state: string;
  walk_rank?: number;
  cost_rank?: number;
  density_rank?: number;
  div_rank?: number;
  pol_rank?: number;
  wfh_rank?: number;
  crime_rank?: number;
  emp_rank?: number;
  positive?: string;
  negative?: string;
  Wikipedia_URL?: string;
}

export interface MatchResults {
  good_matches: City[];
  bad_matches: City[];
  timestamp: string;
  userPreferences: (number | boolean)[];
}

// Load and parse Excel file with more robust error handling for Netlify
export const loadCityData = async (): Promise<City[]> => {
  try {
    // Try to fetch from the root path first
    let response = await fetch('/masterfile.xlsx');
    
    // If that fails, try the public folder path
    if (!response.ok) {
      console.log('Failed to fetch from root path, trying public folder...');
      response = await fetch('./masterfile.xlsx');
    }
    
    if (!response.ok) {
      console.error(`Failed to fetch city data: ${response.status} ${response.statusText}`);
      
      // Return empty array or fallback data if needed
      return [];
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<City>(worksheet);
    
    console.log(`Successfully loaded ${data.length} cities`);
    return data;
  } catch (error) {
    console.error('Error loading city data:', error);
    return [];
  }
};

// Format thumbnail URL based on city and state with better error handling
export const getThumbnailUrl = (city: string, state: string): string => {
  try {
    // Replace spaces with underscores
    const formattedCity = city.replace(/ /g, '_');
    const formattedState = state.replace(/ /g, '_');
    
    return `/thumbnails/${formattedCity}_${formattedState}.jpg`;
  } catch (error) {
    console.error('Error generating thumbnail URL:', error);
    return '/placeholder.svg';
  }
};

// Calculate city scores based on user preferences
export const calculateCityScores = (
  cities: City[], 
  preferences: (number | boolean)[]
): { goodMatches: City[], badMatches: City[] } => {
  if (!cities || cities.length === 0) {
    return { goodMatches: [], badMatches: [] };
  }

  // Extract configuration from preferences
  const safetyPref = preferences[0] as number;
  const employmentPref = preferences[1] as number;
  const diversityPref = preferences[2] as number;
  const affordabilityPref = preferences[3] as number;
  const walkabilityPref = preferences[4] as number;
  const remoteWorkPref = preferences[5] as number;
  const densityPref = preferences[6] as number; // 0-8: rural to urban
  const politicsPref = preferences[7] as number; // 0-8: conservative to liberal
  const cityCount = preferences[8] as number || 5;
  const showBadMatches = preferences[9] as boolean || false;
  
  // Find max ranks for normalization
  const maxRanks = {
    crime: Math.max(...cities.map(c => c.crime_rank || 0)),
    emp: Math.max(...cities.map(c => c.emp_rank || 0)),
    div: Math.max(...cities.map(c => c.div_rank || 0)),
    cost: Math.max(...cities.map(c => c.cost_rank || 0)),
    walk: Math.max(...cities.map(c => c.walk_rank || 0)),
    wfh: Math.max(...cities.map(c => c.wfh_rank || 0)),
    density: Math.max(...cities.map(c => c.density_rank || 0)),
    pol: Math.max(...cities.map(c => c.pol_rank || 0))
  };
  
  // Calculate scores for each city
  const scoredCities = cities.map(city => {
    // For each category: invert rank (lower rank = better) and multiply by preference importance (0-8)
    // For most categories, we want lower ranks, so we invert: (maxRank - city's rank) * preference
    let score = 0;
    
    // Safety: invert crime rank (lower crime rank = safer)
    const safetyScore = ((maxRanks.crime - (city.crime_rank || 0)) / maxRanks.crime) * safetyPref;
    
    // Employment: invert employment rank (lower rank = better employment)
    const employmentScore = ((maxRanks.emp - (city.emp_rank || 0)) / maxRanks.emp) * employmentPref;
    
    // Diversity: invert diversity rank (lower rank = more diverse)
    const diversityScore = ((maxRanks.div - (city.div_rank || 0)) / maxRanks.div) * diversityPref;
    
    // Affordability: invert cost rank (lower rank = more affordable)
    const affordabilityScore = ((maxRanks.cost - (city.cost_rank || 0)) / maxRanks.cost) * affordabilityPref;
    
    // Walkability: invert walkability rank (lower rank = more walkable)
    const walkabilityScore = ((maxRanks.walk - (city.walk_rank || 0)) / maxRanks.walk) * walkabilityPref;
    
    // Remote Work: invert remote work rank (lower rank = better for remote work)
    const remoteWorkScore = ((maxRanks.wfh - (city.wfh_rank || 0)) / maxRanks.wfh) * remoteWorkPref;
    
    // Density: special handling - we compare the city's density rank to the preferred density
    // 0 = rural preference, 8 = urban preference
    const userDensityNormalized = densityPref / 8; // Convert to 0-1 scale
    const cityDensityNormalized = (city.density_rank || 0) / maxRanks.density; // Convert to 0-1 scale
    // Calculate how close the city's density matches user preference (1 = perfect match, 0 = furthest)
    const densityMatchScore = 1 - Math.abs(userDensityNormalized - cityDensityNormalized);
    // Scale by the importance (5 is neutral)
    const densityScore = densityMatchScore * 5;
    
    // Politics: special handling - we compare the city's political rank to the preferred politics
    // 0 = conservative preference, 8 = liberal preference
    const userPoliticsNormalized = politicsPref / 8; // Convert to 0-1 scale
    const cityPoliticsNormalized = (city.pol_rank || 0) / maxRanks.pol; // Convert to 0-1 scale
    // Calculate how close the city's politics matches user preference (1 = perfect match, 0 = furthest)
    const politicsMatchScore = 1 - Math.abs(userPoliticsNormalized - cityPoliticsNormalized);
    // Scale by the importance (5 is neutral)
    const politicsScore = politicsMatchScore * 5;
    
    // Sum all scores to get total score
    score = safetyScore + employmentScore + diversityScore + affordabilityScore +
            walkabilityScore + remoteWorkScore + densityScore + politicsScore;
    
    return {
      ...city,
      score
    };
  });
  
  // Sort cities by score (descending)
  scoredCities.sort((a, b) => b.score - a.score);
  
  // Get top and bottom cities based on cityCount
  const goodMatches = scoredCities.slice(0, cityCount);
  
  const badMatches = showBadMatches 
    ? scoredCities.slice(-cityCount)
    : [];
  
  return { 
    goodMatches, 
    badMatches
  };
};
