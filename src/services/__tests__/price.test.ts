/**
 * Unit tests for price calculation service
 * Tests the core business logic for calculating moving prices
 */

import { describe, it, expect } from 'vitest';

import { calculatePrice, BASE_RATES, ELEVATOR_FEE, RATE_DISTANCE_START } from '../price';
import type { DistanceData, PriceCalculation } from '@/types';

describe('Price Calculation', () => {
  describe('calculatePrice', () => {
    it('should calculate basic price for small apartment without elevator', () => {
      const distanceData: DistanceData = {
        movingDistance: 10,
        baseToStartDistance: 5,
        baseToEndDistance: 7,
      };

      const result = calculatePrice(15, distanceData, 'ingen');

      expect(result).toEqual({
        startFee: BASE_RATES.START_FEE,
        elevatorFee: ELEVATOR_FEE.NONE,
        volumeCost: 15 * BASE_RATES.VOLUME_RATE,
        distanceCost: Math.round(10 * RATE_DISTANCE_START),
        remoteStartSurcharge: 0,
        longDistanceSurcharge: 0,
        totalPrice: expect.any(Number),
      });

      // Verify total calculation
      const expected =
        BASE_RATES.START_FEE +
        ELEVATOR_FEE.NONE +
        15 * BASE_RATES.VOLUME_RATE +
        Math.round(10 * RATE_DISTANCE_START);
      expect(result.totalPrice).toBe(expected);
    });

    it('should add elevator fee when elevators are present', () => {
      const distanceData: DistanceData = {
        movingDistance: 10,
        baseToStartDistance: 5,
        baseToEndDistance: 7,
      };

      const result = calculatePrice(20, distanceData, 'båda');

      expect(result.elevatorFee).toBe(ELEVATOR_FEE.BOTH);
      expect(result.totalPrice).toBeLessThan(
        calculatePrice(20, distanceData, 'ingen').totalPrice,
      );
    });

    it('should apply correct elevator fees based on availability', () => {
      const distanceData: DistanceData = {
        movingDistance: 10,
        baseToStartDistance: 5,
        baseToEndDistance: 7,
      };

      const volume = 20;

      const noElevator = calculatePrice(volume, distanceData, 'ingen');
      const fromOnly = calculatePrice(volume, distanceData, 'från');
      const toOnly = calculatePrice(volume, distanceData, 'till');
      const both = calculatePrice(volume, distanceData, 'båda');

      expect(noElevator.elevatorFee).toBe(ELEVATOR_FEE.NONE);
      expect(fromOnly.elevatorFee).toBe(ELEVATOR_FEE.FROM_ONLY);
      expect(toOnly.elevatorFee).toBe(ELEVATOR_FEE.TO_ONLY);
      expect(both.elevatorFee).toBe(ELEVATOR_FEE.BOTH);
    });

    it('should apply remote start surcharge for distances > 50km from base', () => {
      const distanceData: DistanceData = {
        movingDistance: 100,
        baseToStartDistance: 60, // > 50km
        baseToEndDistance: 20,
      };

      const result = calculatePrice(25, distanceData, 'ingen');

      expect(result.remoteStartSurcharge).toBeGreaterThan(0);
      expect(result.remoteStartSurcharge).toBe(
        Math.round((60 - BASE_RATES.REMOTE_THRESHOLD) * BASE_RATES.REMOTE_RATE),
      );
    });

    it('should apply long distance surcharge for moves > 300km', () => {
      const distanceData: DistanceData = {
        movingDistance: 400, // > 300km
        baseToStartDistance: 20,
        baseToEndDistance: 25,
      };

      const result = calculatePrice(30, distanceData, 'ingen');

      expect(result.longDistanceSurcharge).toBeGreaterThan(0);
      expect(result.longDistanceSurcharge).toBe(
        Math.round(
          (400 - BASE_RATES.LONG_DISTANCE_THRESHOLD) * BASE_RATES.LONG_DISTANCE_RATE,
        ),
      );
    });

    it('should handle edge case with zero volume', () => {
      const distanceData: DistanceData = {
        movingDistance: 10,
        baseToStartDistance: 5,
        baseToEndDistance: 7,
      };

      const result = calculatePrice(0, distanceData, 'ingen');

      expect(result.volumeCost).toBe(0);
      expect(result.totalPrice).toBe(
        BASE_RATES.START_FEE +
          ELEVATOR_FEE.NONE +
          Math.round(10 * RATE_DISTANCE_START),
      );
    });

    it('should handle large volume correctly', () => {
      const distanceData: DistanceData = {
        movingDistance: 50,
        baseToStartDistance: 10,
        baseToEndDistance: 15,
      };

      const result = calculatePrice(100, distanceData, 'båda');

      expect(result.volumeCost).toBe(100 * BASE_RATES.VOLUME_RATE);
      expect(result.totalPrice).toBeGreaterThan(50000); // Should be substantial
    });

    it('should apply all surcharges when applicable', () => {
      const distanceData: DistanceData = {
        movingDistance: 450, // Long distance
        baseToStartDistance: 75, // Remote start
        baseToEndDistance: 30,
      };

      const result = calculatePrice(40, distanceData, 'båda');

      expect(result.remoteStartSurcharge).toBeGreaterThan(0);
      expect(result.longDistanceSurcharge).toBeGreaterThan(0);
      expect(result.elevatorFee).toBe(ELEVATOR_FEE.BOTH);

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

    it('should round prices to nearest whole number', () => {
      const distanceData: DistanceData = {
        movingDistance: 13.7,
        baseToStartDistance: 8.3,
        baseToEndDistance: 9.1,
      };

      const result = calculatePrice(22.5, distanceData, 'från');

      // All price components should be whole numbers
      expect(result.startFee % 1).toBe(0);
      expect(result.elevatorFee % 1).toBe(0);
      expect(result.volumeCost % 1).toBe(0);
      expect(result.distanceCost % 1).toBe(0);
      expect(result.remoteStartSurcharge % 1).toBe(0);
      expect(result.longDistanceSurcharge % 1).toBe(0);
      expect(result.totalPrice % 1).toBe(0);
    });

    it('should handle minimum viable move (1m³, 1km)', () => {
      const distanceData: DistanceData = {
        movingDistance: 1,
        baseToStartDistance: 1,
        baseToEndDistance: 1,
      };

      const result = calculatePrice(1, distanceData, 'ingen');

      expect(result.totalPrice).toBeGreaterThan(0);
      expect(result.volumeCost).toBe(BASE_RATES.VOLUME_RATE);
      expect(result.distanceCost).toBe(Math.round(RATE_DISTANCE_START));
    });
  });

  describe('Price Validation', () => {
    it('should maintain consistent pricing rules', () => {
      const distanceData: DistanceData = {
        movingDistance: 100,
        baseToStartDistance: 20,
        baseToEndDistance: 25,
      };

      // Same conditions should always produce same price
      const result1 = calculatePrice(30, distanceData, 'båda');
      const result2 = calculatePrice(30, distanceData, 'båda');

      expect(result1).toEqual(result2);
    });

    it('should scale linearly with volume', () => {
      const distanceData: DistanceData = {
        movingDistance: 50,
        baseToStartDistance: 10,
        baseToEndDistance: 15,
      };

      const small = calculatePrice(10, distanceData, 'ingen');
      const large = calculatePrice(20, distanceData, 'ingen');

      // Volume cost should be exactly double
      expect(large.volumeCost).toBe(small.volumeCost * 2);

      // Total difference should be exactly the volume cost difference
      expect(large.totalPrice - small.totalPrice).toBe(
        large.volumeCost - small.volumeCost,
      );
    });

    it('should have sensible price ranges for typical moves', () => {
      const localMove: DistanceData = {
        movingDistance: 15,
        baseToStartDistance: 10,
        baseToEndDistance: 8,
      };

      const longMove: DistanceData = {
        movingDistance: 400,
        baseToStartDistance: 20,
        baseToEndDistance: 420,
      };

      const local2Room = calculatePrice(25, localMove, 'ingen');
      const long3Room = calculatePrice(45, longMove, 'båda');

      // Local 2-room move should be reasonable (15k-35k SEK)
      expect(local2Room.totalPrice).toBeGreaterThan(10000);
      expect(local2Room.totalPrice).toBeLessThan(40000);

      // Long-distance 3-room move should be more expensive but not excessive
      expect(long3Room.totalPrice).toBeGreaterThan(local2Room.totalPrice);
      expect(long3Room.totalPrice).toBeLessThan(100000);
    });
  });
});