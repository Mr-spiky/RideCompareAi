
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import LocationInput from '@/components/LocationInput';
import Map from '@/components/Map';
import RideOptions from '@/components/RideOptions';
import UserPreferences from '@/components/UserPreferences';
import { Button } from '@/components/ui/button';
import { RefreshCw, Info } from 'lucide-react';
import { googleMapsService } from '@/lib/googleMapsService';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  const [source, setSource] = useState<string | undefined>();
  const [destination, setDestination] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showApiWarning, setShowApiWarning] = useState(true);
  const isGoogleMapsConfigured = googleMapsService.isConfigured();
  
  const handleSourceChange = (location: string) => {
    setSource(location);
  };
  
  const handleDestinationChange = (location: string) => {
    setDestination(location);
  };
  
  const handleRefreshRides = () => {
    if (source && destination) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };
  
  return (
    <div className="min-h-screen pb-8">
      <Navbar />
      
      <main className="container mx-auto px-4 mt-4">
        {/* Google Maps API Status Alert */}
        {!isGoogleMapsConfigured && showApiWarning && (
          <Alert className="mb-6 glass border-yellow-500/50 bg-yellow-500/10">
            <Info className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-white/90 flex items-center justify-between">
              <span>
                <strong>Demo Mode:</strong> Using simulated data. Add Google Maps API key for real distances. 
                <a 
                  href="/GOOGLE_MAPS_SETUP.md" 
                  target="_blank" 
                  className="underline ml-2 text-yellow-300 hover:text-yellow-200"
                >
                  Setup Guide
                </a>
              </span>
              <button 
                onClick={() => setShowApiWarning(false)}
                className="text-white/60 hover:text-white ml-4"
              >
                ✕
              </button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent leading-tight">
            Find Your Smartest Ride
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Compare fares and ETAs across Ola, Uber & Rapido with AI personalization
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Location inputs */}
            <div className="glass p-6 rounded-xl mb-8 hover:bg-white/25 transition-all duration-300">
              <div className="space-y-5">
                <LocationInput 
                  label="Pickup Location"
                  onLocationSelected={handleSourceChange}
                />
                <LocationInput 
                  label="Destination"
                  onLocationSelected={handleDestinationChange}
                />
                
                <Button 
                  className="w-full compare-button h-12 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  onClick={handleRefreshRides}
                  disabled={!source || !destination || isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Finding best rides...
                    </>
                  ) : (
                    'Compare Rides'
                  )}
                </Button>
              </div>
            </div>

            {/* Map */}
            <Map source={source} destination={destination} />
            
            {/* Ride options */}
            <RideOptions source={source} destination={destination} />
          </div>
          
          <div>
            {/* User preferences */}
            <UserPreferences />
            
            {/* AI insights (placeholder for future feature) */}
            <div className="glass p-6 rounded-xl mt-6 hover:bg-white/25 transition-all duration-300">
              <h3 className="font-semibold mb-4 text-lg text-white">AI Insights</h3>
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-cyan-300 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Surge pricing likely in 30 mins for Ola</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Uber prices are 12% higher than average</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Lower fares typically available after 8pm</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-300 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Based on your history, you prefer Rapido for this route</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto px-4 mt-12 text-center text-white/50 text-sm">
        <p>© 2025 RideCompare.AI • AI-powered urban mobility assistant</p>
      </footer>
    </div>
  );
};

export default Index;
