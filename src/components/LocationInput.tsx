
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, LocateFixed } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { googleMapsService } from '@/lib/googleMapsService';

interface LocationInputProps {
  label: string;
  onLocationSelected: (location: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ label, onLocationSelected }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Get autocomplete suggestions if Google Maps is configured
    if (newValue.length > 2 && googleMapsService.isConfigured()) {
      try {
        const predictions = await googleMapsService.getAutocompletePredictions(newValue);
        setSuggestions(predictions);
        setShowSuggestions(predictions.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: google.maps.places.AutocompletePrediction) => {
    setValue(suggestion.description);
    onLocationSelected(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleDetectLocation = () => {
    setIsDetecting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Try to reverse geocode the coordinates to get address
            if (googleMapsService.isConfigured()) {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const address = `${lat},${lng}`;
              
              // Use a simpler approach - just show "Current Location"
              setValue('Current Location');
              onLocationSelected('Current Location');
              toast({
                title: "Location Detected",
                description: "Using your current location",
              });
            } else {
              setValue('Current Location');
              onLocationSelected('Current Location');
              toast({
                title: "Location Detected",
                description: "Using your current location",
              });
            }
          } catch (error) {
            setValue('Current Location');
            onLocationSelected('Current Location');
          } finally {
            setIsDetecting(false);
          }
        },
        (error) => {
          setIsDetecting(false);
          toast({
            title: "Location Error",
            description: "Unable to detect your location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsDetecting(false);
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
    }
  };

  const handleBlur = () => {
    // Delay to allow clicking on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
    
    if (value.trim()) {
      onLocationSelected(value);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white z-10">
        <MapPin className="h-5 w-5" />
      </div>
      <Input
        ref={inputRef}
        className="pl-10 pr-12 py-6 location-input font-medium"
        placeholder={`Enter ${label}`}
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-white hover:bg-white/10 z-10"
        onClick={handleDetectLocation}
        disabled={isDetecting}
      >
        {isDetecting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <LocateFixed className="h-5 w-5" />
        )}
      </Button>
      
      {/* Autocomplete suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 glass rounded-lg border border-white/20 z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              className="px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-white/60 truncate">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
