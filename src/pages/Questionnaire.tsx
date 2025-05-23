import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import QuestionnaireSlider from '@/components/QuestionnaireSlider';
import { loadCityData, calculateCityScores } from '@/utils/dataService';

// Define the question steps
const questionSteps = [
  {
    question: "How important is safety to you?",
    minLabel: "Not important",
    maxLabel: "Very important",
    description: "Rate how much you prioritize low crime rates and overall safety in your ideal city."
  },
  {
    question: "How important are employment opportunities?",
    minLabel: "Not important",
    maxLabel: "Very important",
    description: "Rate the importance of job availability and career growth potential in your ideal location."
  },
  {
    question: "How important is diversity to you?",
    minLabel: "Not important",
    maxLabel: "Very important",
    description: "Rate how much you value cultural and demographic diversity in your community."
  },
  {
    question: "How important is affordability?",
    minLabel: "Not important",
    maxLabel: "Very important",
    description: "Rate the importance of reasonable housing costs and overall cost of living."
  },
  {
    question: "How important is walkability?",
    minLabel: "Not important",
    maxLabel: "Very important",
    description: "Rate how much you value being able to reach amenities on foot or via public transit."
  },
  {
    question: "How suitable should the area be for remote work?",
    minLabel: "Not important",
    maxLabel: "Very important",
    description: "Rate the importance of internet infrastructure and remote work friendliness."
  },
  {
    question: "What's your preferred population density?",
    minLabel: "Rural",
    maxLabel: "Urban",
    description: "Slide towards rural for less populated areas, or urban for more populated city centers."
  },
  {
    question: "What's your political preference?",
    minLabel: "Conservative",
    maxLabel: "Liberal",
    description: "Indicate where you fall on the political spectrum to find a matching community."
  }
];

const Questionnaire = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(8).fill(4)); // Initialize with middle values
  const [cityCount, setCityCount] = useState<number>(5);
  const [showBadMatches, setShowBadMatches] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cityData, setCityData] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [loadingAttempts, setLoadingAttempts] = useState<number>(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Check if we should use AI-generated preferences
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const useAI = searchParams.get('useAI') === 'true';
    
    if (useAI) {
      const aiPreferences = localStorage.getItem('aiPreferences');
      if (aiPreferences) {
        try {
          const preferences = JSON.parse(aiPreferences);
          setAnswers(preferences);
          toast({
            title: "AI Preferences Applied",
            description: "We've pre-filled the questionnaire based on your description.",
          });
        } catch (error) {
          console.error("Error parsing AI preferences:", error);
        }
      }
    }
  }, [location.search, toast]);

  // Load city data when component mounts
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        console.log(`Attempt ${loadingAttempts + 1} to load city data...`);
        const data = await loadCityData();
        
        if (data && data.length > 0) {
          console.log(`Successfully loaded ${data.length} cities on attempt ${loadingAttempts + 1}`);
          setCityData(data);
          setDataLoaded(true);
        } else {
          throw new Error("No city data returned or empty array");
        }
      } catch (error) {
        console.error(`Error loading data (attempt ${loadingAttempts + 1}):`, error);
        
        if (loadingAttempts < 3) {
          // Retry with exponential backoff
          const delay = Math.pow(2, loadingAttempts) * 1000;
          console.log(`Retrying in ${delay/1000} seconds...`);
          
          setTimeout(() => {
            setLoadingAttempts(prev => prev + 1);
          }, delay);
        } else {
          toast({
            title: "Data Loading Issue",
            description: "We're having trouble loading city data. Please try refreshing the page.",
            variant: "destructive",
          });
        }
      }
    };
    
    fetchCityData();
  }, [loadingAttempts, toast, isInitialLoad]);

  // Progress calculation
  const totalSteps = questionSteps.length + 1; // +1 for the final options step
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSliderChange = (value: number[]) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value[0];
    setAnswers(newAnswers);
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    if (!dataLoaded || cityData.length === 0) {
      // Try one more time to load data
      try {
        console.log("Final attempt to load data before submission...");
        const freshData = await loadCityData();
        
        if (!freshData || freshData.length === 0) {
          throw new Error("Still no city data available");
        }
        
        setCityData(freshData);
        setDataLoaded(true);
        
        // Continue with submission using this fresh data
        processSubmission(freshData);
      } catch (error) {
        console.error("Error on final data loading attempt:", error);
        toast({
          title: "Data Not Available",
          description: "City data could not be loaded. Please try again later or check your internet connection.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } else {
      // Use already loaded data
      processSubmission(cityData);
    }
  };
  
  // Helper function to process submission once we have data
  const processSubmission = (data: any[]) => {
    try {
      console.log(`Processing submission with ${data.length} cities`);
      
      // Create full preferences array (answers + cityCount + showBadMatches)
      const fullPreferences: (number | boolean)[] = [...answers, cityCount, showBadMatches];
      
      console.log("Full preferences:", fullPreferences);
      
      // Calculate city matches using our utility function
      const { goodMatches, badMatches } = calculateCityScores(data, fullPreferences);
      
      console.log(`Found ${goodMatches.length} good matches and ${badMatches.length} bad matches`);
      
      // Store results in localStorage
      const resultsData = {
        good_matches: goodMatches,
        bad_matches: badMatches,
        timestamp: new Date().toISOString(),
        userPreferences: fullPreferences
      };
      
      console.log("Saving results to localStorage:", resultsData);
      localStorage.setItem('matchResults', JSON.stringify(resultsData));
      
      setIsSubmitting(false);
      navigate('/results');
      
    } catch (error) {
      console.error("Error processing questionnaire:", error);
      setIsSubmitting(false);
      toast({
        title: "Processing Error",
        description: "There was a problem processing your preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Current question data
  const currentQuestion = currentStep < questionSteps.length ? questionSteps[currentStep] : null;
  const isLastStep = currentStep === questionSteps.length;
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-center">City Matching Questionnaire</h1>
            <p className="text-center text-gray-600 mt-2">
              Help us understand your preferences to find your ideal cities
            </p>
            
            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-2.5 mt-6">
              <div 
                className="bg-leaf h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-right mt-1 text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>
          
          <Card className="questionnaire-card animate-fade-in">
            <CardHeader>
              {currentQuestion && (
                <h2 className="text-xl font-semibold text-center">{currentQuestion.question}</h2>
              )}
              {isLastStep && (
                <h2 className="text-xl font-semibold text-center">Final Options</h2>
              )}
            </CardHeader>
            
            <CardContent>
              {currentQuestion && (
                <QuestionnaireSlider
                  question=""
                  minLabel={currentQuestion.minLabel}
                  maxLabel={currentQuestion.maxLabel}
                  value={[answers[currentStep]]}
                  onChange={handleSliderChange}
                  description={currentQuestion.description}
                />
              )}
              
              {isLastStep && (
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">How many city recommendations would you like?</h3>
                    <RadioGroup value={cityCount.toString()} onValueChange={(value) => setCityCount(Number(value))}>
                      <div className="flex gap-6 justify-center pt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="3" id="r1" />
                          <Label htmlFor="r1">3 cities</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5" id="r2" />
                          <Label htmlFor="r2">5 cities</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="10" id="r3" />
                          <Label htmlFor="r3">10 cities</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <h3 className="text-lg font-medium">Also show cities to avoid?</h3>
                      <p className="text-sm text-muted-foreground">See which cities might not match your preferences</p>
                    </div>
                    <Switch 
                      checked={showBadMatches} 
                      onCheckedChange={setShowBadMatches} 
                    />
                  </div>

                  {!dataLoaded && (
                    <div className="text-amber-600 text-sm mt-4 p-2 bg-amber-50 border border-amber-200 rounded">
                      Note: City data is still loading. You can continue, but there may be a slight delay.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              
              {!isLastStep && (
                <Button onClick={handleNextStep}>
                  Next
                </Button>
              )}
              
              {isLastStep && (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="leaf-bg-gradient hover:opacity-90"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Finding cities...
                    </>
                  ) : !dataLoaded ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Loading data...
                    </>
                  ) : (
                    "Find My Cities"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Questionnaire;
