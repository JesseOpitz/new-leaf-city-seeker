
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import MovingPlanQuestionnaire from './MovingPlanQuestionnaire';

interface MovingPlanOfferProps {
  city: string;
  state: string;
  onClose: () => void;
}

const MovingPlanOffer = ({ city, state, onClose }: MovingPlanOfferProps) => {
  const [step, setStep] = useState<'intro' | 'questionnaire'>('intro');

  const handleStartQuestionnaire = () => {
    setStep('questionnaire');
  };

  const handleQuestionnaireComplete = () => {
    onClose();
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
                  <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
                  <span>Personalized overview and city introduction</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
                  <span>Comprehensive 20+ item moving checklist</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
                  <span>Detailed cost breakdown for {city}</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
                  <span>30-60-90 day action plan timeline</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
                  <span>Local resources and essential contacts</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
                  <span>Moving company selection guide</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
                  <span>Eco-friendly moving tips and resources</span>
                </li>
              </ul>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-2xl font-bold text-leaf-dark">$4.99</p>
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
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Personalize Your Moving Plan</h3>
              <p className="text-sm text-gray-500 mb-4">
                Complete the questionnaire and provide your email to receive your customized plan.
              </p>

              <MovingPlanQuestionnaire 
                onComplete={handleQuestionnaireComplete}
                onCancel={onClose}
                embedded={true}
                city={city}
                state={state}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovingPlanOffer;
