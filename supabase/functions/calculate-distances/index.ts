/**
 * Smartflytt Calculate Distances Edge Function
 * Production-grade distance calculation service with proper security, caching, and error handling
 */

import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.0';

// Environment-based CORS allowlist for production security
const getAllowedOrigins = (): string[] => {
  const origins = Deno.env.get('ALLOWED_ORIGINS');
  if (!origins) {
    console.warn('ALLOWED_ORIGINS not set, using default');
    return ['https://syfkpifjsnsbdzculmos.supabase.co'];
  }
  return origins.split(',').map(origin => origin.trim());
};

const allowedOrigins = getAllowedOrigins();

const getCorsHeaders = (origin?: string | null) => {
  const isAllowed = origin && allowedOrigins.includes(origin);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
};

// Structured logging interface
interface LogContext {
  requestId: string;
  userId?: string;
  event: string;
  level: 'info' | 'warn' | 'error';
  latencyMs?: number;
  error?: string;
  metadata?: Record<string, any>;
}

const log = (context: LogContext) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    ...context,
  };
  console.log(JSON.stringify(logEntry));
};

// TypeScript interfaces for type safety
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
  cached?: boolean;
  calculatedAt: string;
}

interface GoogleMapsDistanceElement {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  status: string;
}

interface GoogleMapsResponse {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: {
    elements: GoogleMapsDistanceElement[];
  }[];
  status: string;
  error_message?: string;
}

// Simple in-memory cache with TTL (Time To Live)
class DistanceCache {
  private cache = new Map<string, { data: DistanceResponse; expires: number }>();
  private readonly TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  private generateKey(from: string, to: string, baseCoords: string): string {
    return `${from}|${to}|${baseCoords}`;
  }

  get(from: string, to: string, baseCoords: string): DistanceResponse | null {
    const key = this.generateKey(from, to, baseCoords);
    const cached = this.cache.get(key);
    
    if (cached && cached.expires > Date.now()) {
      return { ...cached.data, cached: true };
    }
    
    if (cached) {
      this.cache.delete(key); // Remove expired entry
    }
    
    return null;
  }

  set(from: string, to: string, baseCoords: string, data: DistanceResponse): void {
    const key = this.generateKey(from, to, baseCoords);
    this.cache.set(key, {
      data: { ...data, cached: false },
      expires: Date.now() + this.TTL
    });
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.expires <= now) {
        this.cache.delete(key);
      }
    }
  }
}

const distanceCache = new DistanceCache();

// Rate limiting using in-memory store (simple implementation)
class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private readonly WINDOW_MS = 60 * 1000; // 1 minute
  private readonly MAX_REQUESTS = 100; // Max requests per minute per IP

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const existing = this.requests.get(identifier);

    if (!existing || existing.resetTime <= now) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.WINDOW_MS
      });
      return true;
    }

    if (existing.count >= this.MAX_REQUESTS) {
      return false;
    }

    existing.count++;
    return true;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.requests.entries()) {
      if (value.resetTime <= now) {
        this.requests.delete(key);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

// Retry mechanism with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = Math.min(baseDelay * Math.pow(2, attempt), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Google Maps API call with proper error handling
const callGoogleMapsAPI = async (url: string, timeout: number = 10000): Promise<GoogleMapsResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Smartflytt-Distance-Calculator/1.0'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Google Maps API responded with status ${response.status}`);
    }

    const data = await response.json() as GoogleMapsResponse;

    if (data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if ((error as Error).name === 'AbortError') {
      throw new Error(`Google Maps API request timed out after ${timeout}ms`);
    }
    
    throw error;
  }
};

// Validate address format
const validateAddress = (address: string): boolean => {
  if (!address || typeof address !== 'string') {
    return false;
  }
  
  // Basic validation - should contain at least some alphanumeric characters
  const trimmed = address.trim();
  return trimmed.length >= 3 && /[a-zA-ZåäöÅÄÖ0-9]/.test(trimmed);
};

// Validate coordinates
const validateCoordinates = (lat: number, lng: number): boolean => {
  return !isNaN(lat) && !isNaN(lng) && 
         lat >= -90 && lat <= 90 && 
         lng >= -180 && lng <= 180;
};

// Main handler function
const handler = async (req: Request): Promise<Response> => {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  const clientIP = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   'unknown';

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  // Rate limiting
  if (!rateLimiter.isAllowed(clientIP)) {
    log({
      requestId,
      event: 'rate_limit_exceeded',
      level: 'warn',
      metadata: { clientIP }
    });

    return new Response(
      JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: 60 
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
          ...corsHeaders
        }
      }
    );
  }

  let distanceRequest: DistanceRequest | null = null;

  try {
    // Verify JWT token for authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      log({
        requestId,
        event: 'auth_missing',
        level: 'warn',
        error: 'Missing or invalid authorization header',
        metadata: { clientIP }
      });
      
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Initialize Supabase client for JWT verification
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the JWT token
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      log({
        requestId,
        event: 'auth_failed',
        level: 'warn',
        error: authError?.message || 'Invalid token',
        metadata: { clientIP }
      });
      
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Validate Google Maps API key
    const mapsApiKey = Deno.env.get('MAPS_API_KEY');
    if (!mapsApiKey) {
      throw new Error('Google Maps API key not configured');
    }

    // Parse and validate request body
    try {
      distanceRequest = await req.json() as DistanceRequest;
    } catch (parseError) {
      log({
        requestId,
        userId: user.id,
        event: 'request_parse_error',
        level: 'error',
        error: 'Invalid JSON in request body',
        metadata: { clientIP }
      });
      
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Validate required fields and data
    if (!distanceRequest || 
        !validateAddress(distanceRequest.fromAddress) ||
        !validateAddress(distanceRequest.toAddress) ||
        !validateCoordinates(distanceRequest.baseLatitude, distanceRequest.baseLongitude)) {
      
      log({
        requestId,
        userId: user.id,
        event: 'validation_failed',
        level: 'error',
        error: 'Invalid or missing required fields',
        metadata: {
          clientIP,
          hasFromAddress: !!distanceRequest?.fromAddress,
          hasToAddress: !!distanceRequest?.toAddress,
          validCoords: distanceRequest ? validateCoordinates(distanceRequest.baseLatitude, distanceRequest.baseLongitude) : false
        }
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Invalid or missing required fields',
          required: ['fromAddress', 'toAddress', 'baseLatitude', 'baseLongitude']
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    const { fromAddress, toAddress, baseLatitude, baseLongitude } = distanceRequest;
    const baseCoordinates = `${baseLatitude},${baseLongitude}`;

    log({
      requestId,
      userId: user.id,
      event: 'distance_calculation_started',
      level: 'info',
      metadata: {
        clientIP,
        fromAddress: fromAddress.substring(0, 50), // Truncate for privacy
        toAddress: toAddress.substring(0, 50),
        hasBaseCoords: !!baseCoordinates
      }
    });

    // Check cache first
    const cachedResult = distanceCache.get(fromAddress, toAddress, baseCoordinates);
    if (cachedResult) {
      log({
        requestId,
        userId: user.id,
        event: 'cache_hit',
        level: 'info',
        latencyMs: Date.now() - startTime,
        metadata: { clientIP }
      });

      return new Response(JSON.stringify(cachedResult), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'HIT',
          ...corsHeaders,
        },
      });
    }

    // Prepare Google Maps API URLs
    const apiCalls = [
      {
        name: 'moving_distance',
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(fromAddress)}&destinations=${encodeURIComponent(toAddress)}&mode=driving&avoid=tolls&key=${mapsApiKey}`
      },
      {
        name: 'base_to_start',
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${baseCoordinates}&destinations=${encodeURIComponent(fromAddress)}&mode=driving&avoid=tolls&key=${mapsApiKey}`
      },
      {
        name: 'base_to_end',
        url: `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${baseCoordinates}&destinations=${encodeURIComponent(toAddress)}&mode=driving&avoid=tolls&key=${mapsApiKey}`
      }
    ];

    // Make all API calls with retry logic
    const apiResults = await Promise.all(
      apiCalls.map(async (apiCall) => {
        return retryWithBackoff(async () => {
          const result = await callGoogleMapsAPI(apiCall.url);
          return { name: apiCall.name, data: result };
        });
      })
    );

    // Extract distances and validate responses
    const distances: Record<string, number> = {};
    
    for (const result of apiResults) {
      const element = result.data.rows[0]?.elements[0];
      
      if (!element || element.status !== 'OK') {
        throw new Error(`Failed to get distance for ${result.name}: ${element?.status || 'No data'}`);
      }
      
      if (!element.distance || typeof element.distance.value !== 'number') {
        throw new Error(`Invalid distance data for ${result.name}`);
      }
      
      // Convert from meters to kilometers and round
      distances[result.name] = Math.round(element.distance.value / 1000);
    }

    const response: DistanceResponse = {
      movingDistance: distances.moving_distance,
      baseToStartDistance: distances.base_to_start,
      baseToEndDistance: distances.base_to_end,
      cached: false,
      calculatedAt: new Date().toISOString()
    };

    // Cache the result
    distanceCache.set(fromAddress, toAddress, baseCoordinates, response);

    // Clean up cache and rate limiter periodically
    if (Math.random() < 0.01) { // 1% chance to trigger cleanup
      distanceCache.cleanup();
      rateLimiter.cleanup();
    }

    const latencyMs = Date.now() - startTime;
    log({
      requestId,
      userId: user.id,
      event: 'distance_calculation_completed',
      level: 'info',
      latencyMs,
      metadata: {
        clientIP,
        movingDistance: response.movingDistance,
        baseToStartDistance: response.baseToStartDistance,
        baseToEndDistance: response.baseToEndDistance,
        apiCallsCount: apiCalls.length
      }
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
        'X-Request-ID': requestId,
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    
    log({
      requestId,
      userId: distanceRequest ? 'authenticated' : undefined,
      event: 'distance_calculation_failed',
      level: 'error',
      latencyMs,
      error: error.message,
      metadata: {
        clientIP,
        stack: error.stack,
        fromAddress: distanceRequest?.fromAddress?.substring(0, 50),
        toAddress: distanceRequest?.toAddress?.substring(0, 50)
      }
    });

    // Determine appropriate error status
    let status = 500;
    let errorMessage = 'Internal server error';
    
    if (error.message.includes('Google Maps API')) {
      status = 502;
      errorMessage = 'External service error';
    } else if (error.message.includes('timeout') || error.message.includes('AbortError')) {
      status = 504;
      errorMessage = 'Service timeout';
    } else if (error.message.includes('quota') || error.message.includes('OVER_QUERY_LIMIT')) {
      status = 503;
      errorMessage = 'Service temporarily unavailable';
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        message: error.message,
        requestId,
        // Include helpful info for debugging in development
        ...(Deno.env.get('DENO_ENV') === 'development' && { stack: error.stack })
      }),
      {
        status,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);