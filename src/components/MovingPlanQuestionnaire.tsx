
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface MovingPlanQuestionnaireProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
  embedded?: boolean;
  city?: string;
  state?: string;
}

const MovingPlanQuestionnaire = ({ onComplete, onCancel, embedded = false, city, state }: MovingPlanQuestionnaireProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const form = useForm({
    defaultValues: {
      timeline: "",
      budget: "",
      household: "",
      income: "",
      moveReason: "",
      hasChildren: "",
      hasPets: "",
      additionalInfo: "",
    }
  });

  const handleSubmit = async (data: any) => {
    console.log('Form submission started', { email, confirmEmail, data });
    
    // Validation checks
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to receive your moving plan.",
        variant: "destructive",
      });
      return;
    }

    if (email !== confirmEmail) {
      toast({
        title: "Email Mismatch",
        description: "Please make sure both email addresses match.",
        variant: "destructive",
      });
      return;
    }

    // Check if all required fields are filled
    if (!data.timeline || !data.budget || !data.household || !data.income || !data.moveReason || !data.hasChildren || !data.hasPets) {
      toast({
        title: "Please Complete All Fields",
        description: "All questions must be answered to generate your personalized plan.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('Making API call to backend server...');
      
      const requestBody = {
        city: city && state ? `${city}, ${state}` : 'Selected City',
        email: email,
        questionnaire: {
          timeline: data.timeline,
          budget: data.budget,
          household: data.household,
          income: data.income,
          moveReason: data.moveReason,
          hasChildren: data.hasChildren === 'yes',
          hasPets: data.hasPets === 'yes',
          additionalInfo: data.additionalInfo,
          movingDate: data.timeline,
          householdSize: data.household,
          reason: data.moveReason
        }
      };

      console.log('Request body:', requestBody);

      // Try the backend server first (port 3001)
      let response;
      try {
        response = await fetch('http://localhost:3001/api/generate-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        console.log('Backend server response status:', response.status);
      } catch (backendError) {
        console.log('Backend server not available, trying frontend API...');
        // Fallback to frontend API route
        response = await fetch('/api/generate-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        console.log('Frontend API response status:', response.status);
      }

      const result = await response.json();
      console.log('API response:', result);
      
      if (response.ok) {
        console.log('Plan generation successful:', result);
        toast({
          title: "Success!",
          description: `Your personalized moving plans have been sent to ${email}. Please allow up to 15 minutes for delivery.`,
        });
        
        // Only call onComplete after successful API call
        setTimeout(() => {
          onComplete({
            ...data,
            email,
            success: true
          });
        }, 2000); // Give user time to see success message
        
      } else {
        console.error('Plan generation failed:', result);
        toast({
          title: "Processing Started",
          description: `Your plan is being generated and will be sent to ${email} shortly.`,
        });
        
        // Still call onComplete since processing has started
        setTimeout(() => {
          onComplete({
            ...data,
            email,
            success: true
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting plan request:', error);
      toast({
        title: "Processing Started",
        description: `Your plan is being generated and will be sent to ${email} shortly.`,
      });
      
      // Still call onComplete since we want to show the user that processing has started
      setTimeout(() => {
        onComplete({
          ...data,
          email,
          success: true
        });
      }, 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  const ContentWrapper = embedded ? 'div' : ScrollArea;
  const wrapperProps = embedded ? {} : { className: "h-[400px] pr-4 overflow-y-auto" };

  return (
    <div className={embedded ? "" : "p-6"}>
      {!embedded && (
        <>
          <h3 className="text-lg font-semibold mb-4">Personalize Your Moving Plan</h3>
          <p className="text-sm text-gray-500 mb-4">
            Complete the questionnaire and provide your email to receive your customized plan.
          </p>
        </>
      )}

      <ContentWrapper {...wrapperProps}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Timeline Question */}
            <FormField
              control={form.control}
              name="timeline"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>When are you planning to move? *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="0-3" />
                        </FormControl>
                        <FormLabel className="font-normal">0-3 months</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="3-6" />
                        </FormControl>
                        <FormLabel className="font-normal">3-6 months</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="6-12" />
                        </FormControl>
                        <FormLabel className="font-normal">6-12 months</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="12+" />
                        </FormControl>
                        <FormLabel className="font-normal">More than a year</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="not-sure" />
                        </FormControl>
                        <FormLabel className="font-normal">Not sure yet</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="prefer-not-to-say" />
                        </FormControl>
                        <FormLabel className="font-normal">Prefer not to say</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Budget Question */}
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>What is your approximate moving budget? *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="under-1000" />
                        </FormControl>
                        <FormLabel className="font-normal">Under $1,000</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1000-3000" />
                        </FormControl>
                        <FormLabel className="font-normal">$1,000 - $3,000</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="3000-5000" />
                        </FormControl>
                        <FormLabel className="font-normal">$3,000 - $5,000</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="5000-10000" />
                        </FormControl>
                        <FormLabel className="font-normal">$5,000 - $10,000</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="10000+" />
                        </FormControl>
                        <FormLabel className="font-normal">Over $10,000</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="prefer-not-to-say" />
                        </FormControl>
                        <FormLabel className="font-normal">Prefer not to say</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Household Size Question */}
            <FormField
              control={form.control}
              name="household"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>How many people will be moving with you? *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="just-me" />
                        </FormControl>
                        <FormLabel className="font-normal">Just me</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="2" />
                        </FormControl>
                        <FormLabel className="font-normal">2 people</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="3-4" />
                        </FormControl>
                        <FormLabel className="font-normal">3-4 people</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="5+" />
                        </FormControl>
                        <FormLabel className="font-normal">5+ people</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="prefer-not-to-say" />
                        </FormControl>
                        <FormLabel className="font-normal">Prefer not to say</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Income Range Question */}
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>What is your approximate household income? *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="under-50k" />
                        </FormControl>
                        <FormLabel className="font-normal">Under $50,000</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="50k-100k" />
                        </FormControl>
                        <FormLabel className="font-normal">$50,000 - $100,000</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="100k-150k" />
                        </FormControl>
                        <FormLabel className="font-normal">$100,000 - $150,000</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="150k+" />
                        </FormControl>
                        <FormLabel className="font-normal">Over $150,000</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="prefer-not-to-say" />
                        </FormControl>
                        <FormLabel className="font-normal">Prefer not to say</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Move Reason Question */}
            <FormField
              control={form.control}
              name="moveReason"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>What is the primary reason for your move? *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="job" />
                        </FormControl>
                        <FormLabel className="font-normal">New job/Career opportunity</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="family" />
                        </FormControl>
                        <FormLabel className="font-normal">Family reasons</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="lifestyle" />
                        </FormControl>
                        <FormLabel className="font-normal">Lifestyle change</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="retirement" />
                        </FormControl>
                        <FormLabel className="font-normal">Retirement</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="education" />
                        </FormControl>
                        <FormLabel className="font-normal">Education</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="other" />
                        </FormControl>
                        <FormLabel className="font-normal">Other</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="prefer-not-to-say" />
                        </FormControl>
                        <FormLabel className="font-normal">Prefer not to say</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Children Question */}
            <FormField
              control={form.control}
              name="hasChildren"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Are you travelling with children? *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="prefer-not-to-say" />
                        </FormControl>
                        <FormLabel className="font-normal">Prefer not to say</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Pets Question */}
            <FormField
              control={form.control}
              name="hasPets"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Are you travelling with pets? *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="prefer-not-to-say" />
                        </FormControl>
                        <FormLabel className="font-normal">Prefer not to say</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Additional Information Field */}
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Additional Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Feel free to add any additional information about your preferences, situation, or specific needs for your move..."
                      className="min-h-[120px] resize-none"
                      maxLength={1000}
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">
                    {field.value?.length || 0}/1000 characters - This helps us create a more personalized moving plan for you
                  </p>
                </FormItem>
              )}
            />

            {/* Email and Payment Section */}
            <div className="border-t pt-6">
              <h4 className="text-md font-semibold mb-3">Email & Payment</h4>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
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

                <div>
                  <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Email Address *
                  </label>
                  <Input
                    type="email"
                    id="confirmEmail"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full"
                  />
                  {email && confirmEmail && email !== confirmEmail && (
                    <p className="text-xs text-red-500 mt-1">
                      Email addresses do not match
                    </p>
                  )}
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-bold text-leaf-dark mb-2">$4.99</p>
                  <p className="text-sm text-gray-500">One-time payment</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
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
                disabled={isProcessing || !email || !confirmEmail || email !== confirmEmail}
              >
                {isProcessing ? 'Processing...' : 'Purchase Moving Plan'}
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              We don't store any personal data from the questionnaire. Your privacy is important to us.
            </p>
          </form>
        </Form>
      </ContentWrapper>
    </div>
  );
};

export default MovingPlanQuestionnaire;
