import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface MovingPlanDetailsProps {
  city: string;
  state: string;
  questionnaireData: any;
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (email: string) => void;
  isProcessing: boolean;
  onCancel: () => void;
}

const MovingPlanDetails = ({
  city,
  state,
  questionnaireData,
  onSubmit,
  email,
  setEmail,
  isProcessing,
  onCancel
}: MovingPlanDetailsProps) => {
  const { toast } = useToast();
  const [confirmEmail, setConfirmEmail] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to receive the moving plan.",
        variant: "destructive"
      });
      return;
    }

    if (email !== confirmEmail) {
      toast({
        title: "Email Mismatch",
        description: "Please make sure both email addresses match.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('🚀 Starting backend API call to generate multi-PDF moving plan...');
      console.log('📍 City:', city, 'State:', state);
      console.log('📋 Raw questionnaire data:', questionnaireData);
      console.log('📧 Email:', email);
      
      // Map questionnaire data to backend expected format
      const mappedQuestionnaire = {
        movingDate: questionnaireData?.timeline || 'not specified',
        budget: questionnaireData?.budget || 'not specified', 
        householdSize: questionnaireData?.household === 'just-me' ? 1 : 
                      questionnaireData?.household === '2' ? 2 :
                      questionnaireData?.household === '3-4' ? 3 :
                      questionnaireData?.household === '5+' ? 5 : 1,
        income: questionnaireData?.income || 'not specified',
        reason: questionnaireData?.moveReason || 'not specified',
        hasChildren: questionnaireData?.hasChildren || false,
        hasPets: questionnaireData?.hasPets || false,
        additionalInfo: questionnaireData?.additionalInfo || ''
      };
      
      console.log('📋 Mapped questionnaire data:', mappedQuestionnaire);
      
      // Call the backend API
      const backendUrl = 'https://new-leaf-net.onrender.com/api/generate-plan';
      console.log('🌐 Backend URL:', backendUrl);
      
      const requestPayload = {
        city: `${city}, ${state}`,
        email: email,
        questionnaire: mappedQuestionnaire
      };
      
      console.log('📤 Request payload:', JSON.stringify(requestPayload, null, 2));
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseData = await response.json();
      console.log('📨 Response data:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
      }
      
      console.log('✅ Backend API call successful!');
      
      // Show success popup
      setShowSuccessPopup(true);
      
      // Call the parent's onSubmit to handle payment processing
      onSubmit(e);
      
    } catch (error) {
      console.error('❌ Error calling backend API:', error);
      toast({
        title: "Plan Generation Error",
        description: `There was an issue generating your moving plan: ${error.message}. Please try again or contact support.`,
        variant: "destructive"
      });
    }
  };
  
  if (showSuccessPopup) {
    const guideCount = 4 + (questionnaireData?.hasChildren || questionnaireData?.hasPets ? 1 : 0);
    
    return (
      <div className="p-6 text-center">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-leaf-dark mb-4">Congratulations!</h3>
          <p className="text-lg mb-2">Your Complete Moving Plan Package is Being Generated</p>
          <p className="text-lg font-medium text-leaf-dark mb-4">{email}</p>
          <div className="bg-leaf-light p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-leaf-dark mb-2">Your package includes {guideCount} comprehensive guides:</h4>
            <ul className="text-sm text-gray-700 text-left max-w-md mx-auto">
              <li>• Welcome & Introduction Guide</li>
              <li>• Moving Checklist & Timeline</li>
              <li>• Cost Breakdown & Local Resources</li>
              <li>• Seasonal Living Guide</li>
              {(questionnaireData?.hasChildren || questionnaireData?.hasPets) && (
                <li>• {questionnaireData?.hasChildren && questionnaireData?.hasPets ? 'Family & Pets' : questionnaireData?.hasChildren ? 'Children & Family' : 'Pet Owner'} Guide</li>
              )}
            </ul>
          </div>
          <p className="text-sm text-gray-600">
            Please allow up to 15 minutes for all guides to be generated and sent. If you are having issues receiving your plans, please contact us at support@woridle.com
          </p>
        </div>
        <Button onClick={onCancel} className="bg-leaf hover:bg-leaf-dark">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4 text-leaf-dark">Your Complete Moving Plan Package</h3>
      
      <p className="text-sm text-gray-600 mb-6">
        Based on your responses, we've created a comprehensive moving plan package specifically for you.
        Here's what you'll receive after purchase:
      </p>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-leaf-dark mb-2">Comprehensive Moving Plan Package for {city}, {state}</h4>
        
        <div className="grid gap-3">
          <div className="flex items-start">
            <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Welcome & Introduction Guide:</span>
              <p className="text-sm text-gray-600">Personalized city overview, cultural insights, and transition strategies</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Moving Checklist & Timeline:</span>
              <p className="text-sm text-gray-600">30-60-90 day action plan with comprehensive moving checklist</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Cost Breakdown & Local Resources:</span>
              <p className="text-sm text-gray-600">Detailed budget analysis and essential local contacts directory</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Seasonal Living Guide:</span>
              <p className="text-sm text-gray-600">Weather patterns, seasonal foods, and year-round lifestyle tips</p>
            </div>
          </div>

          {(questionnaireData?.hasChildren || questionnaireData?.hasPets) && (
            <div className="flex items-start">
              <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">
                  {questionnaireData?.hasChildren && questionnaireData?.hasPets ? 'Family & Pets' : 
                   questionnaireData?.hasChildren ? 'Children & Family' : 'Pet Owner'} Guide:
                </span>
                <p className="text-sm text-gray-600">
                  Specialized moving advice and resources for 
                  {questionnaireData?.hasChildren && questionnaireData?.hasPets ? ' families with children and pets' : 
                   questionnaireData?.hasChildren ? ' families with children' : ' pet owners'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Email Address
          </label>
          <Input
            id="confirmEmail"
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder="Confirm your email address"
            required
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your personalized moving plan package will be generated and sent to this email immediately after payment.
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-leaf-dark">$3.99</p>
          <p className="text-sm text-gray-500">One-time payment • Complete package delivery</p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-leaf hover:bg-leaf-dark disabled:bg-gray-400"
            disabled={isProcessing || !email || !confirmEmail}
          >
            {isProcessing ? "Processing..." : "Purchase Complete Package"}
          </Button>
        </div>
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Your questionnaire responses are used only to personalize your moving plan and are not stored long-term.
      </p>
    </div>
  );
};

export default MovingPlanDetails;
