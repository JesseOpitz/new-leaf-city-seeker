import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import MovingPlanQuestionnaire from './MovingPlanQuestionnaire';
import MovingPlanDetails from './MovingPlanDetails';
import { generateMovingPlan, checkBackendHealth, PlanGenerationRequest } from '@/services/planGeneratorService';

interface MovingPlanOfferProps {
  city: string;
  state: string;
  onClose: () => void;
}

const MovingPlanOffer = ({ city, state, onClose }: MovingPlanOfferProps) => {
  const [step, setStep] = useState<'offer' | 'questionnaire' | 'generating' | 'success' | 'error'>('offer');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const fullCityName = `${city}, ${state}`;

  const handleStartQuestionnaire = async () => {
    // First check if backend is healthy
    console.log('🔍 Checking backend connectivity before starting...');
    
    try {
      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        toast({
          title: "Connection Issue",
          description: "Unable to connect to our servers. Please try again in a moment.",
          variant: "destructive",
        });
        return;
      }
      console.log('✅ Backend health check passed');
    } catch (error) {
      console.error('❌ Backend health check failed:', error);
      toast({
        title: "Connection Error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
      return;
    }

    setStep('questionnaire');
  };

  const handleQuestionnaireSubmit = async (data: {
    email?: string;
    movingDate: string;
    budget: string;
    householdSize: number;
    income: string;
    reason: string;
  }) => {
    console.log('📝 Form submitted with data:', data);
    setStep('generating');
    setError('');

    try {
      const request: PlanGenerationRequest = {
        city: fullCityName,
        email: data.email,
        questionnaire: {
          movingDate: data.movingDate,
          budget: data.budget,
          householdSize: data.householdSize,
          income: data.income,
          reason: data.reason,
        }
      };

      console.log('🚀 Submitting plan generation request...');
      const response = await generateMovingPlan(request);
      
      console.log('✅ Plan generation successful:', response);
      setResult(response);
      setStep('success');

      toast({
        title: "Success!",
        description: response.message,
      });

    } catch (error) {
      console.error('❌ Plan generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      setStep('error');

      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRetry = () => {
    setStep('questionnaire');
    setError('');
    setResult(null);
  };

  const handleDownload = () => {
    if (result?.downloadUrl) {
      const fullUrl = result.downloadUrl.startsWith('http') 
        ? result.downloadUrl 
        : `https://new-leaf-net.onrender.com${result.downloadUrl}`;
      
      console.log('📥 Opening download URL:', fullUrl);
      window.open(fullUrl, '_blank');
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'offer':
        return (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Get Your Personalized Moving Plan</h3>
              <p className="text-muted-foreground">
                Get a detailed, AI-generated moving plan specifically tailored for your move to {fullCityName}
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Your plan will include:</h4>
              <ul className="text-sm text-left space-y-1 text-muted-foreground">
                <li>• Personalized overview for {fullCityName}</li>
                <li>• Pre-move checklist based on your timeline</li>
                <li>• Cost breakdown for your budget</li>
                <li>• 30-60-90 day action plan</li>
                <li>• Local resources and helpful contacts</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleStartQuestionnaire} 
                className="flex-1 leaf-bg-gradient hover:opacity-90"
              >
                Get My Plan
              </Button>
              <Button variant="outline" onClick={onClose}>
                Maybe Later
              </Button>
            </div>
          </div>
        );

      case 'questionnaire':
        return (
          <MovingPlanQuestionnaire 
            city={fullCityName}
            onSubmit={handleQuestionnaireSubmit}
            onBack={() => setStep('offer')}
          />
        );

      case 'generating':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-leaf"></div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Creating Your Moving Plan</h3>
              <p className="text-muted-foreground">
                Our AI is generating a personalized moving plan for {fullCityName}...
              </p>
              <p className="text-sm text-muted-foreground">
                This usually takes 30-60 seconds
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Your Plan is Ready!</h3>
              <p className="text-muted-foreground">
                {result?.message || `Your personalized moving plan for ${fullCityName} has been generated.`}
              </p>
            </div>
            
            <div className="space-y-3">
              {result?.downloadUrl && (
                <Button 
                  onClick={handleDownload}
                  className="w-full leaf-bg-gradient hover:opacity-90"
                >
                  Download Your Plan
                </Button>
              )}
              <Button variant="outline" onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Something Went Wrong</h3>
              <p className="text-muted-foreground">
                {error || 'We encountered an error while generating your moving plan.'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleRetry} className="flex-1 leaf-bg-gradient hover:opacity-90">
                Try Again
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Moving Plan for {fullCityName}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default MovingPlanOffer;
