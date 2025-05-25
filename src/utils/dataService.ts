
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

// Load and parse Excel file with robust error handling
export const loadCityData = async (): Promise<City[]> => {
  try {
    console.log('Starting to load city data...');
    
    // Add a cache-busting parameter to prevent browser caching
    const timestamp = new Date().getTime();
    
    // First try the local path which should be available in Netlify
    console.log('Attempting to load data from local path...');
    
    const response = await fetch(`/masterfile.xlsx?t=${timestamp}`, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch local file with status: ${response.status}`);
    }
    
    console.log('Successfully fetched data file, processing...');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<City>(worksheet);
    
    console.log(`Successfully loaded ${data.length} cities`);
    return data;
  } catch (localError) {
    console.error('Error loading local city data:', localError);
    
    try {
      // As a fallback, try GitHub
      console.log('Trying GitHub file as fallback...');
      const timestamp = new Date().getTime();
      const githubUrl = `https://raw.githubusercontent.com/JesseOpitz/new-leaf-city-seeker/main/public/masterfile.xlsx?t=${timestamp}`;
      
      console.log(`Attempting to load from: ${githubUrl}`);
      const response = await fetch(githubUrl, { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from GitHub with status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json<City>(worksheet);
      
      console.log(`Successfully loaded ${data.length} cities from GitHub`);
      return data;
    } catch (githubError) {
      console.error('Error loading GitHub city data:', githubError);
      
      // Provide a simple dataset as emergency fallback
      console.warn('Loading emergency fallback data with minimal city set');
      return [
        { city: "New York", state: "New York" },
        { city: "Los Angeles", state: "California" },
        { city: "Chicago", state: "Illinois" },
        { city: "Houston", state: "Texas" },
        { city: "Phoenix", state: "Arizona" }
      ];
    }
  }
};

// Format thumbnail URL based on city and state
export const getThumbnailUrl = (city: string, state: string): string => {
  try {
    // Replace spaces with underscores
    const formattedCity = city.replace(/ /g, '_');
    const formattedState = state.replace(/ /g, '_');
    
    // Use GitHub repository thumbnails directory
    return `https://raw.githubusercontent.com/JesseOpitz/new-leaf-city-seeker/main/thumbnails/${formattedCity}_${formattedState}.jpg`;
  } catch (error) {
    console.error('Error generating thumbnail URL:', error);
    return 'https://via.placeholder.com/300x200?text=City+Image';
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

  console.log(`Starting scoring for ${cities.length} cities with preferences:`, preferences);

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
  
  // Filter out cities that don't have rank data
  const validCities = cities.filter(city => 
    city.crime_rank && city.emp_rank && city.div_rank && 
    city.cost_rank && city.walk_rank && city.wfh_rank && 
    city.density_rank && city.pol_rank
  );
  
  console.log(`Filtered to ${validCities.length} cities with complete ranking data`);
  
  if (validCities.length === 0) {
    return { goodMatches: [], badMatches: [] };
  }
  
  // Find max ranks for normalization
  const maxRanks = {
    crime: Math.max(...validCities.map(c => c.crime_rank || 0)),
    emp: Math.max(...validCities.map(c => c.emp_rank || 0)),
    div: Math.max(...validCities.map(c => c.div_rank || 0)),
    cost: Math.max(...validCities.map(c => c.cost_rank || 0)),
    walk: Math.max(...validCities.map(c => c.walk_rank || 0)),
    wfh: Math.max(...validCities.map(c => c.wfh_rank || 0)),
    density: Math.max(...validCities.map(c => c.density_rank || 0)),
    pol: Math.max(...validCities.map(c => c.pol_rank || 0))
  };
  
  console.log('Max ranks:', maxRanks);
  
  // Calculate scores for each city
  const scoredCities = validCities.map(city => {
    // For each category: invert rank (lower rank = better) and multiply by preference importance (0-8)
    // For most categories, we want lower ranks, so we invert: (maxRank - city's rank + 1) * preference
    let score = 0;
    
    // Safety: invert crime rank (lower crime rank = safer)
    const safetyScore = ((maxRanks.crime - (city.crime_rank || 0) + 1) / maxRanks.crime) * safetyPref;
    
    // Employment: invert employment rank (lower rank = better employment)
    const employmentScore = ((maxRanks.emp - (city.emp_rank || 0) + 1) / maxRanks.emp) * employmentPref;
    
    // Diversity: invert diversity rank (lower rank = more diverse)
    const diversityScore = ((maxRanks.div - (city.div_rank || 0) + 1) / maxRanks.div) * diversityPref;
    
    // Affordability: invert cost rank (lower rank = more affordable)
    const affordabilityScore = ((maxRanks.cost - (city.cost_rank || 0) + 1) / maxRanks.cost) * affordabilityPref;
    
    // Walkability: invert walkability rank (lower rank = more walkable)
    const walkabilityScore = ((maxRanks.walk - (city.walk_rank || 0) + 1) / maxRanks.walk) * walkabilityPref;
    
    // Remote Work: invert remote work rank (lower rank = better for remote work)
    const remoteWorkScore = ((maxRanks.wfh - (city.wfh_rank || 0) + 1) / maxRanks.wfh) * remoteWorkPref;
    
    // Density: special handling - we compare the city's density rank to the preferred density
    // 0 = rural preference, 8 = urban preference
    const userDensityNormalized = densityPref / 8; // Convert to 0-1 scale
    const cityDensityNormalized = (city.density_rank || 0) / maxRanks.density; // Convert to 0-1 scale
    // Calculate how close the city's density matches user preference (1 = perfect match, 0 = furthest)
    const densityMatchScore = 1 - Math.abs(userDensityNormalized - cityDensityNormalized);
    // Scale by importance
    const densityScore = densityMatchScore * densityPref;
    
    // Politics: special handling - we compare the city's political rank to the preferred politics
    // 0 = conservative preference, 8 = liberal preference
    const userPoliticsNormalized = politicsPref / 8; // Convert to 0-1 scale
    const cityPoliticsNormalized = (city.pol_rank || 0) / maxRanks.pol; // Convert to 0-1 scale
    // Calculate how close the city's politics matches user preference (1 = perfect match, 0 = furthest)
    const politicsMatchScore = 1 - Math.abs(userPoliticsNormalized - cityPoliticsNormalized);
    // Scale by importance
    const politicsScore = politicsMatchScore * politicsPref;
    
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
  
  console.log('Top 5 scored cities:', scoredCities.slice(0, 5).map(c => ({ city: c.city, state: c.state, score: c.score })));
  console.log('Bottom 5 scored cities:', scoredCities.slice(-5).map(c => ({ city: c.city, state: c.state, score: c.score })));
  
  // Get top and bottom cities based on cityCount
  const goodMatches = scoredCities.slice(0, cityCount);
  
  // For bad matches, take from the bottom but make sure they don't overlap with good matches
  const badMatches = showBadMatches 
    ? scoredCities.slice(-(cityCount)).reverse() // reverse so worst is first
    : [];
  
  console.log(`Returning ${goodMatches.length} good matches and ${badMatches.length} bad matches`);
  
  return { 
    goodMatches, 
    badMatches
  };
};
