import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Check } from 'lucide-react';
import MovingPlanQuestionnaire from './MovingPlanQuestionnaire';
import MovingPlanDetails from './MovingPlanDetails';

interface MovingPlanOfferProps {
  city: string;
  state: string;
  onClose: () => void;
}

const MovingPlanOffer = ({ city, state, onClose }: MovingPlanOfferProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'intro' | 'questionnaire' | 'details'>('intro');
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);

  const handleStartQuestionnaire = () => {
    setStep('questionnaire');
  };

  const handleQuestionnaireComplete = (data: any) => {
    setQuestionnaireData(data);
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful!",
        description: `Your personalized moving plan for ${city}, ${state} will be sent to ${email} within 24 hours.`,
      });
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-leaf-dark p-4 text-white">
          <h2 className="text-xl font-semibold">Personalized Moving Plan</h2>
          <p>For {city}, {state}</p>
        </div>
        
        {step === 'intro' && (
          <div className="p-6 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">What You'll Get:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={20} className="text-leaf-dark mr-2 mt-0.5" />
                  <span>Customized moving checklist tailored to {city}</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-leaf-dark mr-2 mt-0.5" />
                  <span>Budget planning guide with local cost estimates</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-leaf-dark mr-2 mt-0.5" />
                  <span>Local neighborhood recommendations based on your preferences</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-leaf-dark mr-2 mt-0.5" />
                  <span>Essential local resources and contacts</span>
                </li>
              </ul>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-2xl font-bold text-leaf-dark">$3.99</p>
              <p className="text-sm text-gray-500">One-time payment</p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStartQuestionnaire} 
                className="bg-leaf hover:bg-leaf-dark"
              >
                Personalize
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              We don't store any personal data from the questionnaire. Your privacy is important to us.
            </p>
          </div>
        )}
        
        {step === 'questionnaire' && (
          <div className="overflow-y-auto flex-1">
            <MovingPlanQuestionnaire 
              onComplete={handleQuestionnaireComplete}
              onCancel={onClose}
            />
          </div>
        )}

        {step === 'details' && (
          <div className="overflow-y-auto flex-1">
            <MovingPlanDetails
              city={city}
              state={state}
              questionnaireData={questionnaireData}
              onSubmit={handleSubmit}
              email={email}
              setEmail={setEmail}
              isProcessing={isProcessing}
              onCancel={onClose}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MovingPlanOffer;
