import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

interface MovingPlanQuestionnaireProps {
  city: string;
  state: string;
  onClose: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const MovingPlanQuestionnaire = ({ city, state, onClose, onComplete, onCancel, embedded }: MovingPlanQuestionnaireProps) => {
  const [email, setEmail] = useState('');
  const [responses, setResponses] = useState({
    housingType: '',
    budgetRange: '',
    priority: '',
    familyDetails: '',
    jobMarket: '',
    lifestyle: '',
    additionalInfo: '',
    hasChildren: '',
    hasPets: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResponses(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return; // Prevent double submission
    }
    
    setIsSubmitting(true);

    // Show immediate feedback
    toast({
      title: "Processing Your Request",
      description: `Your moving plan for ${city} will be sent to ${email}. Please allow up to 15 minutes for delivery.`,
      duration: 5000,
    });

    // Close modal and redirect immediately
    if (onComplete) onComplete();
    else onClose();
    setTimeout(() => {
      window.location.href = '/';
    }, 500);

    try {
      const response = await fetch('https://new-leaf-net.onrender.com/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: `${city}, ${state}`,
          email,
          questionnaire: responses
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate plan');
      }

      console.log('Plan generation initiated successfully:', data);

    } catch (error) {
      console.error('Error generating plan:', error);
      // Show error toast but don't change the user flow since they've already been redirected
      toast({
        title: "Request Processing",
        description: "Your request has been received. If you don't receive your plan within 15 minutes, please contact support.",
        variant: "destructive",
        duration: 8000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    if (onCancel) onCancel();
    else onClose();
  };

  if (embedded) {
    return (
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm focus:ring-leaf focus:border-leaf block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <Label htmlFor="housingType" className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Housing Type
            </Label>
            <Select onValueChange={(value) => handleSelectChange('housingType', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select housing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Budget Range
            </Label>
            <Select onValueChange={(value) => handleSelectChange('budgetRange', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-1500">Under $1,500</SelectItem>
                <SelectItem value="1500-2500">$1,500 - $2,500</SelectItem>
                <SelectItem value="2500-3500">$2,500 - $3,500</SelectItem>
                <SelectItem value="over-3500">Over $3,500</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              What is your top priority when choosing a neighborhood?
            </Label>
            <Select onValueChange={(value) => handleSelectChange('priority', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="schools">Good Schools</SelectItem>
                <SelectItem value="commute">Easy Commute</SelectItem>
                <SelectItem value="amenities">Amenities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="familyDetails" className="block text-sm font-medium text-gray-700 mb-2">
              Tell us about your family (size, ages, etc.)
            </Label>
            <Textarea
              id="familyDetails"
              name="familyDetails"
              rows={3}
              className="shadow-sm focus:ring-leaf focus:border-leaf block w-full sm:text-sm border-gray-300 rounded-md"
              onChange={handleChange}
              value={responses.familyDetails}
            />
          </div>

          <div>
            <Label htmlFor="jobMarket" className="block text-sm font-medium text-gray-700 mb-2">
              What type of job market are you seeking?
            </Label>
            <Textarea
              id="jobMarket"
              name="jobMarket"
              rows={3}
              className="shadow-sm focus:ring-leaf focus:border-leaf block w-full sm:text-sm border-gray-300 rounded-md"
              onChange={handleChange}
              value={responses.jobMarket}
            />
          </div>

          <div>
            <Label htmlFor="lifestyle" className="block text-sm font-medium text-gray-700 mb-2">
              Describe your ideal lifestyle
            </Label>
            <Textarea
              id="lifestyle"
              name="lifestyle"
              rows={3}
              className="shadow-sm focus:ring-leaf focus:border-leaf block w-full sm:text-sm border-gray-300 rounded-md"
              onChange={handleChange}
              value={responses.lifestyle}
            />
          </div>

          <div>
            <Label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
              Any additional information to help us customize your plan?
            </Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              rows={3}
              className="shadow-sm focus:ring-leaf focus:border-leaf block w-full sm:text-sm border-gray-300 rounded-md"
              onChange={handleChange}
              value={responses.additionalInfo}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Do you have children?
            </Label>
            <RadioGroup onValueChange={(value) => handleRadioChange('hasChildren', value)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="children-yes" />
                <Label htmlFor="children-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="children-no" />
                <Label htmlFor="children-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Do you have pets?
            </Label>
            <RadioGroup onValueChange={(value) => handleRadioChange('hasPets', value)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="pets-yes" />
                <Label htmlFor="pets-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="pets-no" />
                <Label htmlFor="pets-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelClick}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-leaf hover:bg-leaf-dark text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Purchase Plan - $4.99'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-leaf-dark mb-6 text-center">
            Tell us about your moving preferences
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow-sm focus:ring-leaf focus:border-leaf block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <Label htmlFor="housingType" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Housing Type
              </Label>
              <Select onValueChange={(value) => handleSelectChange('housingType', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select housing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Budget Range
              </Label>
              <Select onValueChange={(value) => handleSelectChange('budgetRange', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1500">Under $1,500</SelectItem>
                  <SelectItem value="1500-2500">$1,500 - $2,500</SelectItem>
                  <SelectItem value="2500-3500">$2,500 - $3,500</SelectItem>
                  <SelectItem value="over-3500">Over $3,500</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                What is your top priority when choosing a neighborhood?
              </Label>
              <Select onValueChange={(value) => handleSelectChange('priority', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="schools">Good Schools</SelectItem>
                  <SelectItem value="commute">Easy Commute</SelectItem>
                  <SelectItem value="amenities">Amenities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="familyDetails" className="block text-sm font-medium text-gray-700 mb-2">
                Tell us about your family (size, ages, etc.)
              </Label>
              <Textarea
                id="familyDetails"
                name="familyDetails"
                rows={3}
                className="shadow-sm focus:ring-leaf focus:border-leaf block w-full sm:text-sm border-gray-300 rounded-md"
                onChange={handleChange}
                value={responses.familyDetails}
              />
            </div>

            <div>
              <Label htmlFor="jobMarket" className="block text-sm font-medium text-gray-700 mb-2">
                What type of job market are you seeking?
              </Label>
              <Textarea
                id="jobMarket"
                name="jobMarket"
                rows={3}
                className="shadow-sm focus:ring-leaf focus:border-leaf block w-full sm:text-sm border-gray-300 rounded-md"
                onChange={handleChange}
                value={responses.jobMarket}
              />
            </div>

            <div>
              <Label htmlFor="lifestyle" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your ideal lifestyle
              </Label>
              <Textarea
                id="lifestyle"
                name="lifestyle"
                rows={3}
                className="shadow-sm focus:ring-leaf focus:border-leaf block w-full sm:text-sm border-gray-300 rounded-md"
                onChange={handleChange}
                value={responses.lifestyle}
              />
            </div>

            <div>
              <Label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Any additional information to help us customize your plan?
              </Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                rows={3}
                className="shadow-sm focus:ring-leaf focus:border-leaf block w-full sm:text-sm border-gray-300 rounded-md"
                onChange={handleChange}
                value={responses.additionalInfo}
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Do you have children?
              </Label>
              <RadioGroup onValueChange={(value) => handleRadioChange('hasChildren', value)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="children-yes" />
                  <Label htmlFor="children-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="children-no" />
                  <Label htmlFor="children-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Do you have pets?
              </Label>
              <RadioGroup onValueChange={(value) => handleRadioChange('hasPets', value)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="pets-yes" />
                  <Label htmlFor="pets-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="pets-no" />
                  <Label htmlFor="pets-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelClick}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-leaf hover:bg-leaf-dark text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Purchase Plan - $4.99'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MovingPlanQuestionnaire;
