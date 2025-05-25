
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DistanceRequest {
  fromAddress: string;
  toAddress: string;
  baseLatitude: number;
  baseLongitude: number;
}

interface DistanceResponse {
  movingDistance: number;
  baseToStartDistance: number;
  baseToEndDistance: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const mapsApiKey = Deno.env.get('MAPS_API_KEY');
    
    if (!mapsApiKey) {
      throw new Error('Maps API key not configured');
    }

    const { fromAddress, toAddress, baseLatitude, baseLongitude }: DistanceRequest = await req.json();
    
    console.log('Calculating distances for:', { fromAddress, toAddress, baseLatitude, baseLongitude });

    // Prepare addresses for API calls
    const baseCoordinates = `${baseLatitude},${baseLongitude}`;
    
    // Calculate distance between from and to addresses
    const movingDistanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(fromAddress)}&destinations=${encodeURIComponent(toAddress)}&key=${mapsApiKey}`;
    
    // Calculate distance from base to start address
    const baseToStartUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${baseCoordinates}&destinations=${encodeURIComponent(fromAddress)}&key=${mapsApiKey}`;
    
    // Calculate distance from base to end address
    const baseToEndUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${baseCoordinates}&destinations=${encodeURIComponent(toAddress)}&key=${mapsApiKey}`;

    // Make all API calls
    const [movingResponse, baseToStartResponse, baseToEndResponse] = await Promise.all([
      fetch(movingDistanceUrl),
      fetch(baseToStartUrl),
      fetch(baseToEndUrl)
    ]);

    const [movingData, baseToStartData, baseToEndData] = await Promise.all([
      movingResponse.json(),
      baseToStartResponse.json(),
      baseToEndResponse.json()
    ]);

    // Extract distances (convert from meters to kilometers)
    const movingDistance = Math.round(movingData.rows[0].elements[0].distance.value / 1000);
    const baseToStartDistance = Math.round(baseToStartData.rows[0].elements[0].distance.value / 1000);
    const baseToEndDistance = Math.round(baseToEndData.rows[0].elements[0].distance.value / 1000);

    console.log('Calculated distances:', { movingDistance, baseToStartDistance, baseToEndDistance });

    const response: DistanceResponse = {
      movingDistance,
      baseToStartDistance,
      baseToEndDistance
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error calculating distances:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to calculate distances' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
