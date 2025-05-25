
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
  console.log('=== SCORING DEBUG ===');
  console.log('Input cities count:', cities.length);
  console.log('Preferences:', preferences);

  if (!cities || cities.length === 0) {
    console.log('No cities to score');
    return { goodMatches: [], badMatches: [] };
  }

  // Extract configuration from preferences
  const safetyPref = preferences[0] as number;
  const employmentPref = preferences[1] as number;
  const diversityPref = preferences[2] as number;
  const affordabilityPref = preferences[3] as number;
  const walkabilityPref = preferences[4] as number;
  const remoteWorkPref = preferences[5] as number;
  const densityPref = preferences[6] as number;
  const politicsPref = preferences[7] as number;
  const cityCount = preferences[8] as number || 5;
  const showBadMatches = preferences[9] as boolean || false;
  
  console.log('Extracted preferences:', {
    safetyPref, employmentPref, diversityPref, affordabilityPref,
    walkabilityPref, remoteWorkPref, densityPref, politicsPref,
    cityCount, showBadMatches
  });
  
  // Filter out cities that don't have rank data - be more lenient
  const validCities = cities.filter(city => {
    const hasRanks = city.crime_rank !== undefined && city.crime_rank !== null &&
                    city.emp_rank !== undefined && city.emp_rank !== null &&
                    city.div_rank !== undefined && city.div_rank !== null &&
                    city.cost_rank !== undefined && city.cost_rank !== null &&
                    city.walk_rank !== undefined && city.walk_rank !== null &&
                    city.wfh_rank !== undefined && city.wfh_rank !== null &&
                    city.density_rank !== undefined && city.density_rank !== null &&
                    city.pol_rank !== undefined && city.pol_rank !== null;
    
    if (!hasRanks) {
      console.log('City missing rank data:', city.city, city.state, {
        crime_rank: city.crime_rank,
        emp_rank: city.emp_rank,
        div_rank: city.div_rank,
        cost_rank: city.cost_rank,
        walk_rank: city.walk_rank,
        wfh_rank: city.wfh_rank,
        density_rank: city.density_rank,
        pol_rank: city.pol_rank
      });
    }
    
    return hasRanks;
  });
  
  console.log('Valid cities after filtering:', validCities.length);
  
  if (validCities.length === 0) {
    console.log('No valid cities after filtering - returning fallback');
    // Return first few cities as fallback
    const fallbackCities = cities.slice(0, cityCount);
    return { 
      goodMatches: fallbackCities, 
      badMatches: showBadMatches ? cities.slice(-cityCount).reverse() : [] 
    };
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
    let totalScore = 0;
    
    // For ranking categories, lower rank = better, so we invert
    if (safetyPref > 0) {
      const safetyScore = ((maxRanks.crime - (city.crime_rank || 0) + 1) / maxRanks.crime) * safetyPref;
      totalScore += safetyScore;
    }
    
    if (employmentPref > 0) {
      const employmentScore = ((maxRanks.emp - (city.emp_rank || 0) + 1) / maxRanks.emp) * employmentPref;
      totalScore += employmentScore;
    }
    
    if (diversityPref > 0) {
      const diversityScore = ((maxRanks.div - (city.div_rank || 0) + 1) / maxRanks.div) * diversityPref;
      totalScore += diversityScore;
    }
    
    if (affordabilityPref > 0) {
      const affordabilityScore = ((maxRanks.cost - (city.cost_rank || 0) + 1) / maxRanks.cost) * affordabilityPref;
      totalScore += affordabilityScore;
    }
    
    if (walkabilityPref > 0) {
      const walkabilityScore = ((maxRanks.walk - (city.walk_rank || 0) + 1) / maxRanks.walk) * walkabilityPref;
      totalScore += walkabilityScore;
    }
    
    if (remoteWorkPref > 0) {
      const remoteWorkScore = ((maxRanks.wfh - (city.wfh_rank || 0) + 1) / maxRanks.wfh) * remoteWorkPref;
      totalScore += remoteWorkScore;
    }
    
    // For density and politics, we match preference to city's position
    if (densityPref > 0) {
      const userDensityNormalized = densityPref / 8;
      const cityDensityNormalized = (city.density_rank || 0) / maxRanks.density;
      const densityMatchScore = 1 - Math.abs(userDensityNormalized - cityDensityNormalized);
      totalScore += densityMatchScore * densityPref;
    }
    
    if (politicsPref > 0) {
      const userPoliticsNormalized = politicsPref / 8;
      const cityPoliticsNormalized = (city.pol_rank || 0) / maxRanks.pol;
      const politicsMatchScore = 1 - Math.abs(userPoliticsNormalized - cityPoliticsNormalized);
      totalScore += politicsMatchScore * politicsPref;
    }
    
    return {
      ...city,
      score: totalScore
    };
  });
  
  // Sort cities by score (descending)
  scoredCities.sort((a, b) => b.score - a.score);
  
  console.log('Top 10 scored cities:', scoredCities.slice(0, 10).map(c => ({ 
    city: c.city, 
    state: c.state, 
    score: c.score.toFixed(2) 
  })));
  
  // Get top cities for good matches
  const goodMatches = scoredCities.slice(0, cityCount);
  
  // For bad matches, get the lowest scoring cities that aren't in good matches
  const badMatches = showBadMatches 
    ? scoredCities.slice(-(cityCount)).reverse()
    : [];
  
  console.log('Final results:', {
    goodMatchesCount: goodMatches.length,
    badMatchesCount: badMatches.length,
    goodMatches: goodMatches.map(c => `${c.city}, ${c.state}`),
    badMatches: badMatches.map(c => `${c.city}, ${c.state}`)
  });
  
  return { 
    goodMatches, 
    badMatches
  };
};
