import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, MapPin, FileText, DollarSign, Users } from 'lucide-react';
import { cn } from "@/lib/utils";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import MovingPlanOffer from '@/components/MovingPlanOffer';
import { loadCityData } from '@/utils/dataService';

interface City {
  city: string;
  state: string;
}

const MovingPlan = () => {
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [showOffer, setShowOffer] = useState(false);

  React.useEffect(() => {
    const loadCities = async () => {
      try {
        const cityData = await loadCityData();
        setCities(cityData);
      } catch (error) {
        console.error('Error loading city data:', error);
      }
    };
    loadCities();
  }, []);

  const filteredCities = cities.filter(city =>
    `${city.city}, ${city.state}`.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setOpen(false);
    setSearchValue(`${city.city}, ${city.state}`);
  };

  const handleGetMovingPlan = () => {
    if (selectedCity) {
      setShowOffer(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white">
      <NavBar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-leaf-dark mb-6">
              Get Your Personalized Moving Plan
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Make your relocation stress-free with a comprehensive, customized moving guide
            </p>
          </div>

          {/* What's Included Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-leaf mr-3" />
                <h3 className="text-xl font-semibold text-leaf-dark">Comprehensive Planning</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-leaf mr-2 mt-0.5 flex-shrink-0" />
                  <span>Personalized moving timeline and checklist</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-leaf mr-2 mt-0.5 flex-shrink-0" />
                  <span>Local resources and contact information</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-leaf mr-2 mt-0.5 flex-shrink-0" />
                  <span>Neighborhood recommendations based on your needs</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="h-8 w-8 text-leaf mr-3" />
                <h3 className="text-xl font-semibold text-leaf-dark">Budget Planning</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-leaf mr-2 mt-0.5 flex-shrink-0" />
                  <span>Detailed cost breakdown for your destination</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-leaf mr-2 mt-0.5 flex-shrink-0" />
                  <span>Housing market insights and trends</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-leaf mr-2 mt-0.5 flex-shrink-0" />
                  <span>Living expenses and salary expectations</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Price Section */}
          <div className="text-center mb-8">
            <div className="bg-leaf-light rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-leaf-dark mb-2">Only $3.99</h2>
              <p className="text-gray-600">One-time payment • Delivered instantly</p>
            </div>
          </div>

          {/* City Search Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-leaf-dark mb-6 text-center">
              Where are you planning to move?
            </h3>
            
            <div className="max-w-md mx-auto mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search for your destination city
              </label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedCity ? `${selectedCity.city}, ${selectedCity.state}` : "Select a city..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search cities..." 
                      value={searchValue}
                      onValueChange={setSearchValue}
                    />
                    <CommandList>
                      <CommandEmpty>No city found.</CommandEmpty>
                      <CommandGroup>
                        {filteredCities.slice(0, 10).map((city) => (
                          <CommandItem
                            key={`${city.city}-${city.state}`}
                            value={`${city.city}, ${city.state}`}
                            onSelect={() => handleCitySelect(city)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCity?.city === city.city && selectedCity?.state === city.state
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                            {city.city}, {city.state}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="text-center">
              <Button
                onClick={handleGetMovingPlan}
                disabled={!selectedCity}
                className="bg-leaf hover:bg-leaf-dark text-white px-8 py-3 text-lg"
              >
                Get Moving Plan
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {showOffer && selectedCity && (
        <MovingPlanOffer
          city={selectedCity.city}
          state={selectedCity.state}
          onClose={() => setShowOffer(false)}
        />
      )}
    </div>
  );
};

export default MovingPlan;
