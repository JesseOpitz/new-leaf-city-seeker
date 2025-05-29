
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
    
    // Try multiple GitHub URLs with different approaches
    const githubUrls = [
      'https://raw.githubusercontent.com/JesseOpitz/new-leaf-city-seeker/main/public/masterfile.xlsx',
      'https://github.com/JesseOpitz/new-leaf-city-seeker/raw/main/public/masterfile.xlsx',
      'https://raw.githubusercontent.com/JesseOpitz/new-leaf-city-seeker/main/masterfile.xlsx',
      'https://github.com/JesseOpitz/new-leaf-city-seeker/raw/main/masterfile.xlsx'
    ];
    
    for (const url of githubUrls) {
      try {
        console.log(`Attempting to load from: ${url}`);
        
        const response = await fetch(url, { 
          method: 'GET',
          headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,*/*'
          }
        });
        
        if (response.ok) {
          console.log(`Successfully fetched from: ${url}`);
          const arrayBuffer = await response.arrayBuffer();
          
          if (arrayBuffer.byteLength === 0) {
            throw new Error('Received empty file');
          }
          
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json<City>(worksheet);
          
          console.log(`Successfully loaded ${data.length} cities from ${url}`);
          console.log('Sample city data:', data[0]);
          console.log('Cities with positive descriptions:', data.filter(c => c.positive).length);
          console.log('Cities with negative descriptions:', data.filter(c => c.negative).length);
          
          if (data.length === 0) {
            throw new Error('No data found in spreadsheet');
          }
          
          return data;
        } else {
          console.log(`Failed to fetch from ${url}: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error loading from ${url}:`, error);
      }
    }
    
    throw new Error('All GitHub URLs failed to load data');
    
  } catch (error) {
    console.error('Complete failure to load city data:', error);
    throw new Error(`Failed to load city data: ${error.message}`);
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
    throw new Error('No city data available for scoring');
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
  
  // Filter cities with ranking data, but be more lenient
  const validCities = cities.filter(city => {
    // Check if at least some ranking data exists
    const hasAnyRanks = [
      city.crime_rank, city.emp_rank, city.div_rank, city.cost_rank,
      city.walk_rank, city.wfh_rank, city.density_rank, city.pol_rank
    ].some(rank => rank !== undefined && rank !== null && !isNaN(Number(rank)));
    
    return hasAnyRanks;
  });
  
  console.log('Valid cities after filtering:', validCities.length);
  console.log('Sample valid cities:', validCities.slice(0, 3).map(c => ({
    city: c.city,
    state: c.state,
    positive: c.positive ? 'Has positive' : 'No positive',
    negative: c.negative ? 'Has negative' : 'No negative'
  })));
  
  if (validCities.length === 0) {
    throw new Error('No cities have valid ranking data');
  }
  
  // Find max ranks for normalization
  const maxRanks = {
    crime: Math.max(...validCities.map(c => Number(c.crime_rank) || 0)),
    emp: Math.max(...validCities.map(c => Number(c.emp_rank) || 0)),
    div: Math.max(...validCities.map(c => Number(c.div_rank) || 0)),
    cost: Math.max(...validCities.map(c => Number(c.cost_rank) || 0)),
    walk: Math.max(...validCities.map(c => Number(c.walk_rank) || 0)),
    wfh: Math.max(...validCities.map(c => Number(c.wfh_rank) || 0)),
    density: Math.max(...validCities.map(c => Number(c.density_rank) || 0)),
    pol: Math.max(...validCities.map(c => Number(c.pol_rank) || 0))
  };
  
  console.log('Max ranks:', maxRanks);
  
  // Calculate scores for each city
  const scoredCities = validCities.map(city => {
    let totalScore = 0;
    
    // For ranking categories, lower rank = better, so we invert
    if (safetyPref > 0 && city.crime_rank) {
      const safetyScore = ((maxRanks.crime - Number(city.crime_rank) + 1) / maxRanks.crime) * safetyPref;
      totalScore += safetyScore;
    }
    
    if (employmentPref > 0 && city.emp_rank) {
      const employmentScore = ((maxRanks.emp - Number(city.emp_rank) + 1) / maxRanks.emp) * employmentPref;
      totalScore += employmentScore;
    }
    
    if (diversityPref > 0 && city.div_rank) {
      const diversityScore = ((maxRanks.div - Number(city.div_rank) + 1) / maxRanks.div) * diversityPref;
      totalScore += diversityScore;
    }
    
    if (affordabilityPref > 0 && city.cost_rank) {
      const affordabilityScore = ((maxRanks.cost - Number(city.cost_rank) + 1) / maxRanks.cost) * affordabilityPref;
      totalScore += affordabilityScore;
    }
    
    if (walkabilityPref > 0 && city.walk_rank) {
      const walkabilityScore = ((maxRanks.walk - Number(city.walk_rank) + 1) / maxRanks.walk) * walkabilityPref;
      totalScore += walkabilityScore;
    }
    
    if (remoteWorkPref > 0 && city.wfh_rank) {
      const remoteWorkScore = ((maxRanks.wfh - Number(city.wfh_rank) + 1) / maxRanks.wfh) * remoteWorkPref;
      totalScore += remoteWorkScore;
    }
    
    // For density and politics, we match preference to city's position
    if (densityPref > 0 && city.density_rank) {
      const userDensityNormalized = densityPref / 8;
      const cityDensityNormalized = Number(city.density_rank) / maxRanks.density;
      const densityMatchScore = 1 - Math.abs(userDensityNormalized - cityDensityNormalized);
      totalScore += densityMatchScore * densityPref;
    }
    
    if (politicsPref > 0 && city.pol_rank) {
      const userPoliticsNormalized = politicsPref / 8;
      const cityPoliticsNormalized = Number(city.pol_rank) / maxRanks.pol;
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
    score: c.score.toFixed(2),
    positive: c.positive ? 'Has positive' : 'No positive'
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
