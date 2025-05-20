
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CityCard from '@/components/CityCard';
import { MatchResults } from '@/utils/dataService';

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<MatchResults | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get results from localStorage
    const storedResults = localStorage.getItem('matchResults');
    
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
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
              {results.good_matches.map((city, index) => (
                <CityCard
                  key={`good-${index}`}
                  city={city.city}
                  state={city.state}
                  description={city.positive_text || "A great match based on your preferences."}
                  wikipediaUrl={city.wikipedia_url}
                  thumbnailUrl={city.thumbnail_url}
                  isGoodMatch={true}
                />
              ))}
            </div>
          </div>
          
          {results.bad_matches && results.bad_matches.length > 0 && (
            <div className="mb-12 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-destructive">
                Cities That Might Not Be a Great Fit
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.bad_matches.map((city, index) => (
                  <CityCard
                    key={`bad-${index}`}
                    city={city.city}
                    state={city.state}
                    description={city.negative_text || "This city may not align well with your preferences."}
                    wikipediaUrl={city.wikipedia_url}
                    thumbnailUrl={city.thumbnail_url}
                    isGoodMatch={false}
                  />
                ))}
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
      
      <Footer />
    </div>
  );
};

export default Results;
