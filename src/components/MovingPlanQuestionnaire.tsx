
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MovingPlanQuestionnaireProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
  embedded?: boolean;
}

const MovingPlanQuestionnaire = ({ onComplete, onCancel, embedded = false }: MovingPlanQuestionnaireProps) => {
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

  const handleSubmit = (data: any) => {
    onComplete(data);
  };

  const ContentWrapper = embedded ? 'div' : ScrollArea;
  const wrapperProps = embedded ? {} : { className: "h-[400px] pr-4 overflow-y-auto" };

  return (
    <div className={embedded ? "" : "p-6"}>
      {!embedded && (
        <>
          <h3 className="text-lg font-semibold mb-4">Personalize Your Moving Plan</h3>
          <p className="text-sm text-gray-500 mb-4">
            This information helps us create a tailored plan. We don't store this data.
            Feel free to select "Prefer not to say" for any question.
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
                  <FormLabel>When are you planning to move?</FormLabel>
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
                  <FormLabel>What is your approximate moving budget?</FormLabel>
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
                  <FormLabel>How many people will be moving with you?</FormLabel>
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
                  <FormLabel>What is your approximate household income?</FormLabel>
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
                  <FormLabel>What is the primary reason for your move?</FormLabel>
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
                  <FormLabel>Are you travelling with children?</FormLabel>
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
                  <FormLabel>Are you travelling with pets?</FormLabel>
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

            {!embedded && (
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-leaf hover:bg-leaf-dark"
                >
                  Complete Questionnaire
                </Button>
              </div>
            )}

            {embedded && (
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="bg-leaf hover:bg-leaf-dark"
                >
                  Complete Questionnaire
                </Button>
              </div>
            )}
          </form>
        </Form>
      </ContentWrapper>
    </div>
  );
};

export default MovingPlanQuestionnaire;
