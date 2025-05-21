
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface IdealCityFormProps {
  onSubmit: (description: string) => void;
}

const MAX_CHARS = 1000;

const IdealCityForm = ({ onSubmit }: IdealCityFormProps) => {
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  
  const charsRemaining = MAX_CHARS - description.length;
  const isNearLimit = charsRemaining <= 100 && charsRemaining > 0;
  const isAtLimit = charsRemaining <= 0;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (description.trim().length < 20) {
      toast({
        title: "Description too short",
        description: "Please provide at least 20 characters to describe your ideal city.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(description);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          placeholder="Describe your ideal living environment, lifestyle preferences, and what matters most to you in a city..."
          className="min-h-[150px]"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, MAX_CHARS))}
        />
        <div className={`text-sm text-gray-500 mt-1 ${isNearLimit ? 'text-amber-600' : ''} ${isAtLimit ? 'text-red-600' : ''}`}>
          {charsRemaining} characters remaining
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full leaf-bg-gradient hover:opacity-90"
      >
        Find My Cities
      </Button>
    </form>
  );
};

export default IdealCityForm;
