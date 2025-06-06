
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Copy, Facebook, Linkedin, Twitter } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CityCard from '@/components/CityCard';
import { MatchResults, getThumbnailUrl } from '@/utils/dataService';
import MovingPlanOffer from '@/components/MovingPlanOffer';

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<MatchResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPlanOffer, setShowPlanOffer] = useState(false);
  const [selectedCity, setSelectedCity] = useState<{city: string, state: string} | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  useEffect(() => {
    // Get results from localStorage
    const storedResults = localStorage.getItem('matchResults');
    
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        console.log('Loaded results from localStorage:', parsedResults);
        console.log('Good matches with descriptions:', parsedResults.good_matches?.map((city: any) => ({
          city: city.city,
          state: city.state,
          positive: city.positive,
          negative: city.negative
        })));
        setResults(parsedResults);
      } catch (error) {
        console.error("Error parsing stored results:", error);
      }
    }
    
    setLoading(false);
  }, []);
  
  const handleTryAgain = () => {
    navigate('/questionnaire');
  };

  const handleRequestPlan = (city: string, state: string) => {
    setSelectedCity({ city, state });
    setShowPlanOffer(true);
  };
  
  const handleCopyToClipboard = async () => {
    if (!results || !results.good_matches || results.good_matches.length === 0) return;
    
    const topThreeCities = results.good_matches.slice(0, 3);
    const formattedText = `Check out my city preferences from New-Leaf.net!\n\n${
      topThreeCities.map((city, index) => `#${index + 1} – ${city.city}, ${city.state}`).join('\n')
    }`;
    
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };
  
  const getShareText = () => {
    if (!results || !results.good_matches || results.good_matches.length === 0) return '';
    
    const topThreeCities = results.good_matches.slice(0, 3);
    return `Check out my city preferences from New-Leaf.net!\n\n${
      topThreeCities.map((city, index) => `#${index + 1} – ${city.city}, ${city.state}`).join('\n')
    }`;
  };
  
  const shareUrl = 'https://new-leaf.net';
  const shareText = encodeURIComponent(getShareText());
  
  // If no results and done loading, redirect to questionnaire
  useEffect(() => {
    if (!loading && !results) {
      navigate('/questionnaire');
    }
  }, [loading, results, navigate]);
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-leaf mb-4"></div>
            <p className="text-lg">Loading your city matches...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!results) {
    return null; // This will trigger redirect
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Your City Matches</h1>
            <p className="text-xl text-gray-600">
              Based on your preferences, here are the cities that might be a good fit for your next chapter
            </p>
          </div>
          
          <div className="mb-12 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 text-leaf-dark">
              Cities You Might Love
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.good_matches.map((city, index) => {
                console.log('Rendering good match city:', {
                  city: city.city,
                  state: city.state,
                  positive: city.positive,
                  hasPositive: !!city.positive
                });
                
                return (
                  <CityCard
                    key={`good-${city.city}-${city.state}-${index}`}
                    city={city.city}
                    state={city.state}
                    description={city.positive || "A great match based on your preferences."}
                    wikipediaUrl={city.Wikipedia_URL}
                    thumbnailUrl={getThumbnailUrl(city.city, city.state)}
                    isGoodMatch={true}
                    onRequestPlan={() => handleRequestPlan(city.city, city.state)}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Share Results Section */}
          <div className="mb-12 animate-fade-in">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-6 text-leaf-dark">
                Share Your Results
              </h2>
              
              <div className="mb-6">
                <Button 
                  onClick={handleCopyToClipboard}
                  className="leaf-bg-gradient hover:opacity-90 mb-4"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copySuccess ? 'Copied to clipboard!' : 'Copy to Clipboard'}
                </Button>
                
                {copySuccess && (
                  <p className="text-green-600 text-sm animate-fade-in">
                    Copied to clipboard!
                  </p>
                )}
              </div>
              
              <div className="flex justify-center space-x-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText() + '\n\n' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  title="Share on X"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                  title="Share on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-colors"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          {results.bad_matches && results.bad_matches.length > 0 && (
            <div className="mb-12 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-destructive">
                Cities That Might Not Be a Great Fit
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.bad_matches.map((city, index) => {
                  console.log('Rendering bad match city:', {
                    city: city.city,
                    state: city.state,
                    negative: city.negative,
                    hasNegative: !!city.negative
                  });
                  
                  return (
                    <CityCard
                      key={`bad-${city.city}-${city.state}-${index}`}
                      city={city.city}
                      state={city.state}
                      description={city.negative || "This city may not align well with your preferences."}
                      wikipediaUrl={city.Wikipedia_URL}
                      thumbnailUrl={getThumbnailUrl(city.city, city.state)}
                      isGoodMatch={false}
                    />
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="text-center mt-10">
            <p className="mb-4 text-gray-600">Not seeing what you expected?</p>
            <Button 
              onClick={handleTryAgain} 
              className="leaf-bg-gradient hover:opacity-90"
            >
              Take the Questionnaire Again
            </Button>
          </div>
        </div>
      </main>
      
      {showPlanOffer && selectedCity && (
        <MovingPlanOffer 
          city={selectedCity.city}
          state={selectedCity.state}
          onClose={() => setShowPlanOffer(false)}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Results;
