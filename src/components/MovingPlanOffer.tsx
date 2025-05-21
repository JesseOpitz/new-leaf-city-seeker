
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Check } from 'lucide-react';

interface MovingPlanOfferProps {
  city: string;
  state: string;
  onClose: () => void;
}

const MovingPlanOffer = ({ city, state, onClose }: MovingPlanOfferProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-leaf-dark p-4 text-white">
          <h2 className="text-xl font-semibold">Personalized Moving Plan</h2>
          <p>For {city}, {state}</p>
        </div>
        
        <div className="p-6">
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
            <p className="text-2xl font-bold text-leaf-dark">$5.99</p>
            <p className="text-sm text-gray-500">One-time payment</p>
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
                We'll send your personalized moving plan to this email within 24 hours.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
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
                {isProcessing ? "Processing..." : "Purchase Plan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MovingPlanOffer;
