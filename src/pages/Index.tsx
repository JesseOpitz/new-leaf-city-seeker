
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
  
  const handleAIDescription = (description: string) => {
    // In future versions, this will use OpenAI to interpret the description
    // For now, show a "coming soon" toast and still navigate to questionnaire
    setProcessingAI(true);
    
    toast({
      title: "AI Description Feature Coming Soon",
      description: "This feature is under development. Taking you to the questionnaire instead.",
    });
    
    setTimeout(() => {
      setProcessingAI(false);
      navigate('/questionnaire');
    }, 2000);
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
