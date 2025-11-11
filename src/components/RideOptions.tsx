
import React, { useEffect, useState } from 'react';
import RideOption, { RideOptionProps } from './RideOption';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { googleMapsService } from '@/lib/googleMapsService';

interface RideOptionsProps {
  source?: string;
  destination?: string;
}

const RideOptions: React.FC<RideOptionsProps> = ({ source, destination }) => {
  const [rideOptions, setRideOptions] = useState<RideOptionProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate dynamic fares based on distance
  useEffect(() => {
    if (source && destination) {
      setIsLoading(true);
      
      const calculateFares = async () => {
        let baseDistance = 0;
        
        try {
          // Try to get real Google Maps distance
          if (googleMapsService.isConfigured()) {
            const realData = await googleMapsService.getDistanceMatrix(source, destination);
            
            if (realData) {
              // Convert meters to kilometers
              baseDistance = realData.distanceValue / 1000;
            }
          }
        } catch (error) {
          console.error('Error fetching real distance:', error);
        }
        
        // Fallback to simulated distance if Google Maps fails
        if (baseDistance === 0) {
          const sourceLength = source.length;
          const destLength = destination.length;
          const combinedLength = (sourceLength + destLength) % 20;
          baseDistance = 5 + combinedLength * 2.5;
        }
        
        // Random variation for ETA based on distance
        const baseETA = Math.max(2, Math.floor(baseDistance / 3));
        const baseTravelTime = Math.max(10, Math.floor(baseDistance * 2.5));
        
        // Fare calculation formulas for each provider (per km + base fare)
        const uberGoFare = Math.round(50 + (baseDistance * 12) + (Math.random() * 30 - 15));
        const olaMinifare = Math.round(40 + (baseDistance * 10) + (Math.random() * 25 - 12));
        const rapidoBikeFare = Math.round(30 + (baseDistance * 7) + (Math.random() * 20 - 10));
        const uberPremierFare = Math.round(80 + (baseDistance * 18) + (Math.random() * 40 - 20));
        const olaPrimeFare = Math.round(70 + (baseDistance * 16) + (Math.random() * 35 - 17));
        
        const options: RideOptionProps[] = [
          {
            provider: 'uber',
            type: 'UberGo',
            fare: uberGoFare,
            eta: baseETA + Math.floor(Math.random() * 3),
            travelTime: baseTravelTime + Math.floor(Math.random() * 5 - 2),
            rating: 4.5 + Math.random() * 0.4,
          },
          {
            provider: 'ola',
            type: 'Ola Mini',
            fare: olaMinifare,
            eta: baseETA + Math.floor(Math.random() * 4) + 2,
            travelTime: baseTravelTime + Math.floor(Math.random() * 6 - 3),
            rating: 4.3 + Math.random() * 0.5,
          },
          {
            provider: 'rapido',
            type: 'Bike',
            fare: rapidoBikeFare,
            eta: Math.max(2, baseETA - 2 + Math.floor(Math.random() * 2)),
            travelTime: Math.max(8, baseTravelTime - 5 + Math.floor(Math.random() * 3)),
            rating: 4.6 + Math.random() * 0.3,
          },
          {
            provider: 'uber',
            type: 'Premier',
            fare: uberPremierFare,
            eta: baseETA + Math.floor(Math.random() * 3) + 1,
            travelTime: baseTravelTime + Math.floor(Math.random() * 4 - 2),
            rating: 4.7 + Math.random() * 0.2,
          },
          {
            provider: 'ola',
            type: 'Prime Sedan',
            fare: olaPrimeFare,
            eta: baseETA + Math.floor(Math.random() * 4) + 1,
            travelTime: baseTravelTime + Math.floor(Math.random() * 5 - 2),
            rating: 4.6 + Math.random() * 0.3,
          },
        ];
        
        // Sort by fare to find cheapest
        const sortedByPrice = [...options].sort((a, b) => a.fare - b.fare);
        const cheapestFare = sortedByPrice[0].fare;
        
        // Sort by total time (ETA + travel time) to find fastest
        const sortedByTime = [...options].sort((a, b) => (a.eta + a.travelTime) - (b.eta + b.travelTime));
        const fastestTotalTime = sortedByTime[0].eta + sortedByTime[0].travelTime;
        
        // Add recommendations
        const optionsWithRecommendations = options.map(option => {
          const totalTime = option.eta + option.travelTime;
          const isLowest = option.fare === cheapestFare;
          const isFastest = totalTime === fastestTotalTime;
          
          // Best value = good balance of price and time
          const priceRank = options.filter(o => o.fare < option.fare).length;
          const timeRank = options.filter(o => (o.eta + o.travelTime) < totalTime).length;
          const isBestValue = (priceRank + timeRank) <= 2 && !isLowest && !isFastest;
          
          if (isBestValue) {
            return {
              ...option,
              recommended: true,
              recommendReason: 'Best overall value'
            };
          } else if (isLowest) {
            return {
              ...option,
              recommendReason: 'Lowest price'
            };
          } else if (isFastest) {
            return {
              ...option,
              recommendReason: 'Fastest arrival'
            };
          }
          return option;
        });
        
        setRideOptions(optionsWithRecommendations);
        setIsLoading(false);
      };
      
      calculateFares();
    }
  }, [source, destination]);

  const showMockResults = source && destination;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Available Rides</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">AI Recommended</Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="glass p-12 text-center rounded-xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-white/70 font-medium">Finding best rides...</p>
          </div>
        </div>
      ) : showMockResults ? (
        <Tabs defaultValue="all">
          <TabsList className="glass w-full mb-4">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="economy" className="flex-1">Economy</TabsTrigger>
            <TabsTrigger value="premium" className="flex-1">Premium</TabsTrigger>
            <TabsTrigger value="fastest" className="flex-1">Fastest</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rideOptions.map((option, index) => (
                <RideOption key={index} {...option} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="economy" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rideOptions
                .filter(option => option.fare < 300)
                .map((option, index) => (
                  <RideOption key={index} {...option} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="premium" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rideOptions
                .filter(option => option.fare >= 300)
                .map((option, index) => (
                  <RideOption key={index} {...option} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="fastest" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rideOptions
                .sort((a, b) => (a.eta + a.travelTime) - (b.eta + b.travelTime))
                .slice(0, 3)
                .map((option, index) => (
                  <RideOption 
                    key={index} 
                    {...option} 
                    recommended={index === 0}
                    recommendReason={index === 0 ? "Fastest option" : undefined}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="glass p-8 text-center">
          <p className="text-white/70">Enter pickup and destination to see available rides</p>
        </div>
      )}
    </div>
  );
};

export default RideOptions;
