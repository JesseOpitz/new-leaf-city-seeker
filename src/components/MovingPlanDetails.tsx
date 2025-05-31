
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from 'lucide-react';
import { sendMovingPlanEmail } from '../services/emailService';
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

    try {
      console.log('Starting moving plan generation and email process...');
      console.log('City:', city, 'State:', state);
      console.log('Questionnaire data:', questionnaireData);
      console.log('Email:', email);
      
      // Generate and send the moving plan FIRST
      console.log('About to call sendMovingPlanEmail...');
      await sendMovingPlanEmail({
        city,
        state,
        questionnaireData,
        userEmail: email
      });
      
      console.log('Moving plan email sent successfully, now calling parent onSubmit...');
      // Call the parent's onSubmit to handle payment processing AFTER email is sent
      onSubmit(e);
      
      toast({
        title: "Success!",
        description: `Your personalized moving plan for ${city}, ${state} has been generated and sent to ${email}. Please check your inbox (including spam folder) within the next few minutes.`,
      });
      
    } catch (error) {
      console.error('Error in moving plan process:', error);
      toast({
        title: "Plan Generation Error",
        description: `There was an issue generating your moving plan: ${error.message}. Please try again or contact support.`,
        variant: "destructive"
      });
    }
  };

  // Determine timeline description based on questionnaire data
  const getTimelineDescription = () => {
    switch(questionnaireData?.timeline) {
      case '0-3':
        return 'Short-term moving checklist with immediate action items';
      case '3-6':
        return 'Mid-term planning guide with 3-6 month timeline';
      case '6-12':
        return 'Long-term preparation schedule with quarterly milestones';
      case '12+':
        return 'Extended planning timeline with seasonal preparation steps';
      default:
        return 'Flexible timeline with adaptable scheduling options';
    }
  };

  // Determine budget description based on questionnaire data
  const getBudgetDescription = () => {
    switch(questionnaireData?.budget) {
      case 'under-1000':
        return 'Budget-conscious moving strategies and cost-saving tips';
      case '1000-3000':
        return 'Moderate budget planning with essential service recommendations';
      case '3000-5000':
        return 'Comprehensive budget allocation across all moving aspects';
      case '5000-10000':
        return 'Premium service options with quality-focused recommendations';
      case '10000+':
        return 'Luxury relocation services and high-end provider suggestions';
      default:
        return 'Customizable budget planning with scalable options';
    }
  };

  // Determine housing description based on questionnaire data
  const getHousingDescription = () => {
    switch(questionnaireData?.housingPreference) {
      case 'apartment':
        return 'Apartment/condo hunting guide with rental market insights';
      case 'townhouse':
        return 'Townhouse selection criteria and community evaluations';
      case 'single-family':
        return 'Single-family home buying guidance and neighborhood analysis';
      default:
        return 'Comprehensive housing options overview with comparison tools';
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4 text-leaf-dark">Your Personalized Moving Plan</h3>
      
      <p className="text-sm text-gray-600 mb-6">
        Based on your responses, we've customized a moving plan specifically for you.
        Here's what you'll receive after purchase:
      </p>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-leaf-dark mb-2">Tailored Moving Plan for {city}, {state}</h4>
        
        <ul className="space-y-4">
          <li className="flex items-start">
            <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">AI-Generated Comprehensive Plan:</span>
              <p className="text-sm text-gray-600">2000+ word detailed moving guide created specifically for your situation using advanced AI</p>
            </div>
          </li>
          
          <li className="flex items-start">
            <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Personalized Timeline:</span>
              <p className="text-sm text-gray-600">Custom checklist and milestones based on your moving timeline and household needs</p>
            </div>
          </li>
          
          <li className="flex items-start">
            <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Budget Planning:</span>
              <p className="text-sm text-gray-600">Detailed cost breakdown specific to {city} with budget optimization strategies</p>
            </div>
          </li>
          
          <li className="flex items-start">
            <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Housing Strategy:</span>
              <p className="text-sm text-gray-600">Neighborhood recommendations and market insights for {city}</p>
            </div>
          </li>
          
          <li className="flex items-start">
            <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Local Resources & Contacts:</span>
              <p className="text-sm text-gray-600">Essential services, utilities, and community resources specific to {city}</p>
            </div>
          </li>

          <li className="flex items-start">
            <Check size={20} className="text-leaf-dark mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">30-60-90 Day Action Plan:</span>
              <p className="text-sm text-gray-600">Step-by-step integration guide for your first three months in {city}</p>
            </div>
          </li>
        </ul>
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
          <p className="text-xs text-gray-500 mt-1">
            Your personalized moving plan will be generated and sent to this email immediately after payment.
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-leaf-dark">$5.99</p>
          <p className="text-sm text-gray-500">One-time payment • Instant delivery</p>
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
            className="bg-leaf hover:bg-leaf-dark"
            disabled={isProcessing || !email}
          >
            {isProcessing ? "Processing..." : "Purchase Plan"}
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
