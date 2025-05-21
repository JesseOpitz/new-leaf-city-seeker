
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CityCardProps {
  city: string;
  state: string;
  description: string;
  wikipediaUrl?: string;
  thumbnailUrl?: string;
  isGoodMatch?: boolean;
  onRequestPlan?: () => void;
}

const CityCard = ({
  city,
  state,
  description,
  wikipediaUrl,
  thumbnailUrl = 'https://via.placeholder.com/300x200?text=City+Image',
  isGoodMatch = true,
  onRequestPlan
}: CityCardProps) => {
  return (
    <Card className="city-card">
      <CardHeader className={isGoodMatch ? "bg-leaf-dark" : "bg-destructive"}>
        <h3 className="text-lg font-semibold text-white">{city}, {state}</h3>
      </CardHeader>
      
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={thumbnailUrl} 
          alt={`${city}, ${state}`} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=City+Image';
          }}
        />
      </div>
      
      <CardContent className="pt-4">
        <p className="text-gray-700">{description}</p>
      </CardContent>
      
      <CardFooter className="border-t p-4 flex flex-col space-y-2">
        <div className="flex justify-between items-center w-full">
          {wikipediaUrl && (
            <a 
              href={wikipediaUrl} 
              target="_blank"
              rel="noopener noreferrer" 
              className="text-leaf-dark hover:underline inline-flex items-center"
            >
              Learn more <ExternalLink size={16} className="ml-1" />
            </a>
          )}
        </div>
        
        {isGoodMatch && onRequestPlan && (
          <Button 
            onClick={onRequestPlan}
            className="w-full mt-2 bg-leaf hover:bg-leaf-dark"
          >
            Get Moving Plan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CityCard;
