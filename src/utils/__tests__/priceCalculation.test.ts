/**
 * Unit tests for price calculation functions
 * Tests price calculation logic with various scenarios and edge cases
 */

import { describe, it, expect } from 'vitest';
import { calculatePrice, BASE_RATES, ELEVATOR_FEE, RATE_DISTANCE_START } from '../../services/price';
import type { DistanceData } from '@/types/chatbot';

describe('Price Calculation', () => {
  const mockDistanceData: DistanceData = {
    movingDistance: 50,
    baseToStartDistance: 10,
    baseToEndDistance: 15,
  };

  describe('Basic Price Calculation', () => {
    it('should calculate basic price correctly', () => {
      const result = calculatePrice(25, mockDistanceData, 'båda');
      
      expect(result.startFee).toBe(BASE_RATES.START_FEE);
      expect(result.elevatorFee).toBe(ELEVATOR_FEE.BOTH); // Both addresses have elevators
      expect(result.volumeCost).toBe(25 * BASE_RATES.VOLUME_RATE);
      expect(result.distanceCost).toBe(Math.round(50 * RATE_DISTANCE_START));
      expect(result.remoteStartSurcharge).toBe(0);
      expect(result.longDistanceSurcharge).toBe(0);
    });
  });

  describe('Elevator Fee Calculation', () => {
    it('should add elevator fee when no elevators available', () => {
      const result = calculatePrice(25, mockDistanceData, 'ingen');
      
      expect(result.elevatorFee).toBe(ELEVATOR_FEE.NONE);
      expect(result.totalPrice).toBeGreaterThan(
        calculatePrice(25, mockDistanceData, 'båda').totalPrice
      );
    });

    it('should handle partial elevator availability', () => {
      const resultFrom = calculatePrice(25, mockDistanceData, 'från');
      expect(resultFrom.elevatorFee).toBe(ELEVATOR_FEE.FROM_ONLY);
      
      const resultTo = calculatePrice(25, mockDistanceData, 'till');
      expect(resultTo.elevatorFee).toBe(ELEVATOR_FEE.TO_ONLY);
    });
  });

  describe('Volume Scaling', () => {
    it('should scale price linearly with volume', () => {
      const smallResult = calculatePrice(10, mockDistanceData, 'båda');
      const largeResult = calculatePrice(50, mockDistanceData, 'båda');
      
      expect(largeResult.volumeCost).toBe(smallResult.volumeCost * 5);
    });

    it('should handle fractional volumes', () => {
      const result = calculatePrice(12.5, mockDistanceData, 'båda');
      expect(result.volumeCost).toBe(Math.round(12.5 * BASE_RATES.VOLUME_RATE));
    });
  });

  describe('Distance Surcharges', () => {
    it('should add remote start surcharge when start address is far from base', () => {
      const remoteDistanceData: DistanceData = {
        movingDistance: 50,
        baseToStartDistance: 80, // > 50km threshold
        baseToEndDistance: 15,
      };
      
      const result = calculatePrice(25, remoteDistanceData, 'båda');
      expect(result.remoteStartSurcharge).toBe(
        Math.round((80 - BASE_RATES.REMOTE_THRESHOLD) * BASE_RATES.REMOTE_RATE)
      );
    });

    it('should not add remote start surcharge if start is within threshold', () => {
      const result = calculatePrice(25, mockDistanceData, 'båda');
      expect(result.remoteStartSurcharge).toBe(0);
    });

    it('should add long distance surcharge for moves over threshold', () => {
      const longDistanceData: DistanceData = {
        movingDistance: 400, // > 300km threshold
        baseToStartDistance: 10,
        baseToEndDistance: 15,
      };
      
      const result = calculatePrice(25, longDistanceData, 'båda');
      expect(result.longDistanceSurcharge).toBe(
        Math.round((400 - BASE_RATES.LONG_DISTANCE_THRESHOLD) * BASE_RATES.LONG_DISTANCE_RATE)
      );
    });

    it('should not add long distance surcharge for moves under threshold', () => {
      const result = calculatePrice(25, mockDistanceData, 'båda');
      expect(result.longDistanceSurcharge).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero volume', () => {
      const result = calculatePrice(0, mockDistanceData, 'båda');
      expect(result.volumeCost).toBe(0);
      expect(result.totalPrice).toBeGreaterThan(0);
    });

    it('should handle very large volumes', () => {
      const result = calculatePrice(1000, mockDistanceData, 'båda');
      expect(result.volumeCost).toBe(Math.round(1000 * BASE_RATES.VOLUME_RATE));
    });

    it('should round total price to nearest integer', () => {
      const fractionalVolumeData: DistanceData = {
        movingDistance: 33,
        baseToStartDistance: 10,
        baseToEndDistance: 15,
      };
      
      const result = calculatePrice(10.3, fractionalVolumeData, 'båda');
      expect(Number.isInteger(result.totalPrice)).toBe(true);
    });
  });

  describe('Combined Surcharges', () => {
    it('should handle both remote start and long distance surcharges', () => {
      const complexDistanceData: DistanceData = {
        movingDistance: 400, // Long distance
        baseToStartDistance: 80, // Remote start
        baseToEndDistance: 15,
      };
      
      const result = calculatePrice(25, complexDistanceData, 'ingen');
      
      expect(result.remoteStartSurcharge).toBeGreaterThan(0);
      expect(result.longDistanceSurcharge).toBeGreaterThan(0);
      expect(result.elevatorFee).toBe(ELEVATOR_FEE.NONE);
      
      // Verify total includes all components
      const expectedTotal = 
        result.startFee +
        result.elevatorFee +
        result.volumeCost +
        result.distanceCost +
        result.remoteStartSurcharge +
        result.longDistanceSurcharge;
      
      expect(result.totalPrice).toBe(expectedTotal);
    });
  });

  describe('Price Validation', () => {
    it('should produce consistent results for identical inputs', () => {
      const result1 = calculatePrice(25, mockDistanceData, 'båda');
      const result2 = calculatePrice(25, mockDistanceData, 'båda');
      
      expect(result1.totalPrice).toBe(result2.totalPrice);
    });

    it('should scale price linearly with volume', () => {
      const baseResult = calculatePrice(10, mockDistanceData, 'båda');
      const doubleResult = calculatePrice(20, mockDistanceData, 'båda');
      
      expect(doubleResult.volumeCost).toBe(baseResult.volumeCost * 2);
    });

    it('should produce sensible price ranges for typical moves', () => {
      // Local move
      const localResult = calculatePrice(30, mockDistanceData, 'båda');
      expect(localResult.totalPrice).toBeGreaterThan(2000);
      expect(localResult.totalPrice).toBeLessThan(50000);
      
      // Long distance move
      const longDistanceData: DistanceData = {
        movingDistance: 400,
        baseToStartDistance: 50,
        baseToEndDistance: 60,
      };
      const longResult = calculatePrice(30, longDistanceData, 'båda');
      expect(longResult.totalPrice).toBeGreaterThan(localResult.totalPrice);
    });
  });
});