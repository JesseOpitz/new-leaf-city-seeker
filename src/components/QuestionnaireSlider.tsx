
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface QuestionnaireSliderProps {
  question: string;
  minLabel: string;
  maxLabel: string;
  value: number[];
  onChange: (value: number[]) => void;
  max?: number;
  step?: number;
  description?: string;
}

const QuestionnaireSlider = ({
  question,
  minLabel,
  maxLabel,
  value,
  onChange,
  max = 8,
  step = 1,
  description
}: QuestionnaireSliderProps) => {
  return (
    <div className="slider-container">
      <h3 className="text-lg font-medium mb-2">{question}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      
      <Slider
        value={value}
        onValueChange={onChange}
        max={max}
        step={step}
        className="my-6"
      />
      
      <div className="slider-labels">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};

export default QuestionnaireSlider;
