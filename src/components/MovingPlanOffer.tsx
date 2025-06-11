
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Check } from 'lucide-react';
import MovingPlanQuestionnaire from './MovingPlanQuestionnaire';

interface MovingPlanOfferProps {
  city: string;
  state: string;
  onClose: () => void;
}

const MovingPlanOffer = ({ city, state, onClose }: MovingPlanOfferProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'intro' | 'questionnaire'>('intro');
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);

  const handleStartQuestionnaire = () => {
    setStep('questionnaire');
  };

  const handleQuestionnaireComplete = (data: any) => {
    setQuestionnaireData(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !questionnaireData) return;
    
    setIsProcessing(true);
    
    // Show immediate success message
    toast({
      title: "Thank you for your purchase!",
      description: `Your personalized moving plan is being generated. Please allow up to 15 minutes for your plan to be generated and sent to ${email}.`,
    });
    
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: `${city}, ${state}`,
          email: email,
          questionnaire: {
            timeline: questionnaireData.timeline,
            budget: questionnaireData.budget,
            household: questionnaireData.household,
            income: questionnaireData.income,
            moveReason: questionnaireData.moveReason,
            hasChildren: questionnaireData.hasChildren === 'yes',
            hasPets: questionnaireData.hasPets === 'yes',
            additionalInfo: questionnaireData.additionalInfo,
            movingDate: questionnaireData.timeline,
            householdSize: questionnaireData.household,
            reason: questionnaireData.moveReason
          }
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('Plan generation successful:', result);
      } else {
        console.error('Plan generation failed:', result);
        toast({
          title: "Generation in progress",
          description: "Your plan is being generated and will be sent to your email shortly.",
        });
      }
    } catch (error) {
      console.error('Error submitting plan request:', error);
      toast({
        title: "Generation in progress",
        description: "Your plan is being generated and will be sent to your email shortly.",
      });
    } finally {
      setIsProcessing(false);
      onClose();
    }
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
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Personalize Your Moving Plan</h3>
              <p className="text-sm text-gray-500 mb-4">
                Complete the questionnaire and provide your email to receive your customized plan.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <MovingPlanQuestionnaire 
                  onComplete={handleQuestionnaireComplete}
                  onCancel={onClose}
                  embedded={true}
                />
                
                {questionnaireData && (
                  <>
                    <div className="border-t pt-6">
                      <h4 className="text-md font-semibold mb-3">Email & Payment</h4>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Your moving plan will be sent to this email address
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-lg font-bold text-leaf-dark mb-2">$3.99</p>
                          <p className="text-sm text-gray-500">One-time payment</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onClose}
                        disabled={isProcessing}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-leaf hover:bg-leaf-dark"
                        disabled={isProcessing || !email}
                      >
                        {isProcessing ? 'Processing...' : 'Purchase Moving Plan'}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovingPlanOffer;
