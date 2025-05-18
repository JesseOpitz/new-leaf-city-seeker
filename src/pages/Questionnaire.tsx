
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import QuestionnaireSlider from '@/components/QuestionnaireSlider';

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
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(8).fill(4)); // Initialize with middle values
  const [cityCount, setCityCount] = useState<number>(5);
  const [showBadMatches, setShowBadMatches] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
    
    // Create payload with all answers plus the city count and bad matches preference
    const payload = {
      answers: [...answers, cityCount, showBadMatches]
    };
    
    try {
      // For now, this will be simulated without calling a real API
      // In production, this would call the backend API
      setTimeout(() => {
        // Mock response data
        const mockGoodMatches = [
          {
            city: "Portland",
            state: "Oregon",
            positive_text: "Known for its progressive values, vibrant food scene, and proximity to nature with mountains, forests, and the Pacific coast all nearby.",
            wikipedia_url: "https://en.wikipedia.org/wiki/Portland,_Oregon",
            thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Portland_Oregon_skyline_4.jpg/320px-Portland_Oregon_skyline_4.jpg"
          },
          {
            city: "Minneapolis",
            state: "Minnesota",
            positive_text: "Offers a strong job market, excellent parks system, vibrant arts scene, and progressive values with a focus on sustainability and livability.",
            wikipedia_url: "https://en.wikipedia.org/wiki/Minneapolis",
            thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/MinneapolisCollage.jpg/320px-MinneapolisCollage.jpg"
          },
          {
            city: "Austin",
            state: "Texas",
            positive_text: "A tech hub with a thriving music scene, diverse food options, outdoor recreation opportunities, and a young, educated population.",
            wikipedia_url: "https://en.wikipedia.org/wiki/Austin,_Texas",
            thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Austin_August_2019_19_%28skyline%29.jpg/320px-Austin_August_2019_19_%28skyline%29.jpg"
          }
        ];
        
        const mockBadMatches = showBadMatches ? [
          {
            city: "Detroit",
            state: "Michigan",
            negative_text: "While experiencing revitalization, still faces challenges with crime, poverty, and declining infrastructure in many neighborhoods.",
            wikipedia_url: "https://en.wikipedia.org/wiki/Detroit",
            thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Detroit_Montage_2020.jpg/320px-Detroit_Montage_2020.jpg"
          },
          {
            city: "Stockton",
            state: "California",
            negative_text: "Struggles with high crime rates, unemployment, and financial instability, despite being in proximity to the Bay Area.",
            wikipedia_url: "https://en.wikipedia.org/wiki/Stockton,_California",
            thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Stockton_waterfront_night_skyline_and_arena.jpg/320px-Stockton_waterfront_night_skyline_and_arena.jpg"
          }
        ] : [];
        
        // Store results in localStorage
        localStorage.setItem('matchResults', JSON.stringify({
          good_matches: mockGoodMatches.slice(0, cityCount),
          bad_matches: mockBadMatches,
          timestamp: new Date().toISOString(),
          userPreferences: answers
        }));
        
        setIsSubmitting(false);
        navigate('/results');
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "There was a problem processing your questionnaire. Please try again.",
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
