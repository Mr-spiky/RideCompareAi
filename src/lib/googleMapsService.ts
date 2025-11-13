// Google Maps API Integration Service

interface DistanceMatrixResponse {
  distance: string;
  distanceValue: number; // in meters
  duration: string;
  durationValue: number; // in seconds
}

interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

class GoogleMapsService {
  private apiKey: string;
  private isLoaded: boolean = false;

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  }

  // Check if API key is configured
  isConfigured(): boolean {
    return this.apiKey !== '' && this.apiKey !== 'your_google_maps_api_key_here';
  }

  // Load Google Maps script dynamically
  async loadGoogleMaps(): Promise<void> {
    if (this.isLoaded) return;

    if (!this.isConfigured()) {
      throw new Error('Google Maps API key not configured');
    }

    return new Promise((resolve, reject) => {
      if (window.google?.maps) {
        this.isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });
  }

  // Geocode an address to coordinates
  async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    if (!this.isConfigured()) return null;

    try {
      await this.loadGoogleMaps();
      
      return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
              formattedAddress: results[0].formatted_address,
            });
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  // Get distance and duration between two addresses
  async getDistanceMatrix(
    origin: string,
    destination: string
  ): Promise<DistanceMatrixResponse | null> {
    if (!this.isConfigured()) {
      console.warn('⚠️ Google Maps API not configured');
      return null;
    }

    try {
      await this.loadGoogleMaps();

      // Try Distance Matrix API first
      const distanceMatrixResult = await this.tryDistanceMatrix(origin, destination);
      if (distanceMatrixResult) {
        return distanceMatrixResult;
      }

      // Fallback to Directions API if Distance Matrix fails
      console.log('⚠️ Distance Matrix failed, trying Directions API...');
      return await this.tryDirectionsAPI(origin, destination);

    } catch (error) {
      console.error('Distance calculation error:', error);
      return null;
    }
  }

  // Try Distance Matrix API
  private async tryDistanceMatrix(
    origin: string,
    destination: string
  ): Promise<DistanceMatrixResponse | null> {
    return new Promise((resolve) => {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          console.log('Distance Matrix API Response:', { response, status });
          
          if (status === 'OK' && response && response.rows[0]?.elements[0]) {
            const element = response.rows[0].elements[0];
            if (element.status === 'OK') {
              console.log('✅ Real Google Maps distance retrieved (Distance Matrix):', element.distance.text);
              resolve({
                distance: element.distance.text,
                distanceValue: element.distance.value,
                duration: element.duration.text,
                durationValue: element.duration.value,
              });
              return;
            } else {
              console.warn('⚠️ Distance Matrix element status:', element.status);
            }
          } else {
            console.warn('⚠️ Distance Matrix API status:', status);
            if (response && 'errorMessage' in response) {
              console.error('API Error:', (response as any).errorMessage);
            }
          }
          resolve(null);
        }
      );
    });
  }

  // Try Directions API as fallback
  private async tryDirectionsAPI(
    origin: string,
    destination: string
  ): Promise<DistanceMatrixResponse | null> {
    return new Promise((resolve) => {
      const service = new google.maps.DirectionsService();
      service.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          console.log('Directions API Response:', { status });
          
          if (status === 'OK' && response && response.routes[0]?.legs[0]) {
            const leg = response.routes[0].legs[0];
            console.log('✅ Real Google Maps distance retrieved (Directions API):', leg.distance?.text);
            resolve({
              distance: leg.distance?.text || '0 km',
              distanceValue: leg.distance?.value || 0,
              duration: leg.duration?.text || '0 min',
              durationValue: leg.duration?.value || 0,
            });
          } else {
            console.warn('⚠️ Directions API status:', status);
            resolve(null);
          }
        }
      );
    });
  }

  // Get autocomplete predictions for a location
  async getAutocompletePredictions(
    input: string
  ): Promise<google.maps.places.AutocompletePrediction[]> {
    if (!this.isConfigured() || !input) return [];

    try {
      await this.loadGoogleMaps();

      return new Promise((resolve) => {
        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions(
          {
            input,
            componentRestrictions: { country: 'in' }, // Restrict to India
          },
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              resolve(predictions);
            } else {
              resolve([]);
            }
          }
        );
      });
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  }
}

// Export singleton instance
export const googleMapsService = new GoogleMapsService();

// Type definitions for Google Maps (if not already available)
declare global {
  interface Window {
    google?: typeof google;
  }
}

export type { DistanceMatrixResponse, GeocodeResult };
