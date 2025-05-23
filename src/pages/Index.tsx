import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import IdealCityForm from '@/components/IdealCityForm';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processingAI, setProcessingAI] = useState(false);
  
  const handleGetStarted = () => {
    navigate('/questionnaire');
  };
  
  const handleAIDescription = async (description: string) => {
    setProcessingAI(true);
    
    try {
      console.log("Starting AI description processing...");
      
      // Check for API key in environment variables (Netlify)
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        console.warn("OpenAI API Key not found in environment variables");
        toast({
          title: "API Key Not Available",
          description: "The AI feature is not available right now. Please try the questionnaire instead.",
          variant: "destructive",
        });
        setProcessingAI(false);
        // Redirect to questionnaire after a short delay
        setTimeout(() => navigate('/questionnaire'), 2500);
        return;
      }
      
      console.log("Processing description with OpenAI API...");
      
      // Process the description with OpenAI API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a city matching assistant. Analyze the user's description of their ideal city and extract their preferences for the following categories on a scale of 0-8 (0 being not important at all, 8 being extremely important):
              
              1. Safety (importance of low crime rates)
              2. Employment (importance of job opportunities)
              3. Diversity (importance of cultural diversity)
              4. Affordability (importance of reasonable housing costs)
              5. Walkability (importance of pedestrian-friendly areas)
              6. Remote Work Friendliness (importance of internet infrastructure)
              7. Density (preference from 0=rural to 8=urban)
              8. Politics (preference from 0=conservative to 8=liberal)
              
              Return ONLY a JSON array with exactly 8 numeric values corresponding to these categories. If the description doesn't provide enough information for any category, use a default value of 4 (neutral). If the entire description is insufficient to make reasonable estimates, return a string saying "insufficient_description" instead of the array.`
            },
            {
              role: "user",
              content: description
            }
          ],
          temperature: 0.3,
        }),
      });
      
      if (!response.ok) {
        console.error(`API request failed with status ${response.status}`);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("OpenAI response received:", data);
      const aiResponse = data.choices[0].message.content;
      
      // Parse the AI response
      let preferences;
      try {
        preferences = JSON.parse(aiResponse);
      } catch (e) {
        // If not valid JSON, check if it's the insufficient_description message
        if (aiResponse.includes("insufficient_description")) {
          toast({
            title: "Insufficient Description",
            description: "Please provide more details about your preferences or use the questionnaire instead.",
            variant: "destructive",
          });
          setProcessingAI(false);
          return;
        }
        throw e;
      }
      
      // If we got a valid array of preferences
      if (Array.isArray(preferences) && preferences.length === 8) {
        // Store the AI-generated preferences in localStorage
        localStorage.setItem('aiPreferences', JSON.stringify(preferences));
        
        // Navigate to questionnaire with a flag to use AI preferences
        setProcessingAI(false);
        navigate('/questionnaire?useAI=true');
      } else {
        throw new Error("Invalid response format from AI");
      }
      
    } catch (error) {
      console.error("Error processing AI description:", error);
      toast({
        title: "Processing Error",
        description: "There was a problem analyzing your description. Please try the questionnaire instead.",
        variant: "destructive",
      });
      setProcessingAI(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-leaf to-leaf-dark bg-clip-text text-transparent">
              Find Your Perfect City
            </h1>
            <p className="text-xl text-gray-600">
              Discover US cities that match your lifestyle, values, and preferences
            </p>
          </div>
          
          <div className="bg-white dark:bg-card rounded-2xl shadow-lg p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Ready to turn over a new leaf?
              </h2>
              <p className="text-gray-600 mb-6">
                Answer a few questions about your preferences and we'll match you with cities that align 
                with your ideal lifestyle. Our algorithm considers factors like safety, affordability, 
                employment opportunities, diversity, walkability, and more.
              </p>
              
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="w-full leaf-bg-gradient hover:opacity-90"
              >
                Get Started with Questionnaire
              </Button>
            </div>
            
            <div className="relative my-8">
              <Separator />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-card px-4">
                <span className="text-gray-500">OR</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Describe Your Ideal City
              </h2>
              <p className="text-gray-600 mb-6">
                Tell us in your own words what you're looking for in a city, and our AI will interpret your preferences.
              </p>
              
              <IdealCityForm onSubmit={handleAIDescription} />
              
              {processingAI && (
                <div className="mt-4 text-center text-gray-600">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-leaf mr-2"></div>
                  Processing your description...
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-medium mb-4">Why New Leaf?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-card p-5 rounded-xl shadow">
                <h4 className="font-semibold text-leaf-dark mb-2">Data-Driven</h4>
                <p className="text-gray-600">Our recommendations are based on reliable data from trusted sources.</p>
              </div>
              <div className="bg-white dark:bg-card p-5 rounded-xl shadow">
                <h4 className="font-semibold text-leaf-dark mb-2">Lifestyle-Focused</h4>
                <p className="text-gray-600">We match you with cities that align with your personal values and preferences.</p>
              </div>
              <div className="bg-white dark:bg-card p-5 rounded-xl shadow">
                <h4 className="font-semibold text-leaf-dark mb-2">No Registration</h4>
                <p className="text-gray-600">Get city recommendations without creating an account or sharing personal data.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
