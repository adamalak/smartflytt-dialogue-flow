/**
 * Test utilities and helpers for Smartflytt application
 * Provides reusable test setup, mocks, and utilities
 */

import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import type { User, TestContext, MockApiResponse } from '@/types';

// Test wrapper component
interface TestWrapperProps {
  children: React.ReactNode;
  initialRoute?: string;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ 
  children, 
  initialRoute = '/' 
}) => {
  // Mock window.location for routing tests
  if (initialRoute !== '/') {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        pathname: initialRoute,
      },
      writable: true,
    });
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
};

// Custom render function with providers
const customRender = (
  ui: React.ReactElement,
  options?: RenderOptions & { initialRoute?: string }
): RenderResult => {
  const { initialRoute, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper initialRoute={initialRoute}>
        {children}
      </TestWrapper>
    ),
    ...renderOptions,
  });
};

// Mock user data
export const mockUsers = {
  admin: {
    id: 'admin-user-id',
    email: 'admin@smartflytt.se',
    name: 'Test Admin',
    role: 'admin' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  regular: {
    id: 'regular-user-id',
    email: 'user@example.com',
    name: 'Test User',
    role: 'user' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
} satisfies Record<string, User>;

// Mock chatbot data
export const mockChatbotData = {
  address: {
    street: 'Testgatan 123',
    postal: '12345',
    city: 'Stockholm',
  },
  contactInfo: {
    name: 'Test Andersson',
    email: 'test@example.com',
    phone: '070-123-45-67',
  },
  moveQuoteData: {
    moveType: 'bostad' as const,
    date: '2024-06-15',
    from: {
      street: 'Gamla gatan 1',
      postal: '11111',
      city: 'Stockholm',
    },
    to: {
      street: 'Nya gatan 2',
      postal: '22222',
      city: 'Göteborg',
    },
    rooms: '2 rok' as const,
    volume: 25,
    elevator: 'båda' as const,
    contact: {
      name: 'Test Andersson',
      email: 'test@example.com',
      phone: '070-123-45-67',
    },
    gdprConsent: true,
  },
  distanceData: {
    movingDistance: 470,
    baseToStartDistance: 12,
    baseToEndDistance: 8,
  },
  priceCalculation: {
    startFee: 2500,
    elevatorFee: 0,
    volumeCost: 7500,
    distanceCost: 14100,
    remoteStartSurcharge: 0,
    longDistanceSurcharge: 4700,
    totalPrice: 28800,
  },
};

// API response mocks
export const createMockApiResponse = <T,>(
  data: T,
  options: Partial<MockApiResponse<T>> = {}
): MockApiResponse<T> => ({
  success: true,
  data,
  requestId: 'test-request-id',
  delay: 0,
  shouldFail: false,
  ...options,
});

export const createMockApiError = (
  message: string,
  status = 500
): MockApiResponse<never> => ({
  success: false,
  error: message,
  requestId: 'test-request-id',
  delay: 0,
  shouldFail: true,
  ...{ status },
});

// Supabase mock helpers
export const mockSupabaseResponse = <T,>(data: T, error: any = null) => ({
  data,
  error,
  status: error ? 400 : 200,
  statusText: error ? 'Bad Request' : 'OK',
});

// Form testing helpers
export const fillFormField = async (
  input: HTMLElement,
  value: string
): Promise<void> => {
  const { userEvent } = await import('@testing-library/user-event');
  const user = userEvent.setup();
  await user.clear(input);
  await user.type(input, value);
};

export const submitForm = async (form: HTMLFormElement): Promise<void> => {
  const { userEvent } = await import('@testing-library/user-event');
  const user = userEvent.setup();
  await user.click(form.querySelector('button[type="submit"]') as HTMLElement);
};

// Chatbot testing helpers
export const simulateChatbotFlow = async (steps: string[]): Promise<void> => {
  const { userEvent } = await import('@testing-library/user-event');
  const user = userEvent.setup();
  
  for (const step of steps) {
    await user.type(document.querySelector('input[type="text"]') as HTMLElement, step);
    await user.keyboard('{Enter}');
  }
};

// Wait for async operations
export const waitForAsyncOperation = (ms = 100): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Create test context
export const createTestContext = (
  overrides: Partial<TestContext> = {}
): TestContext => ({
  skipAnimations: true,
  mockData: {},
  ...overrides,
});

// Accessibility testing helpers
export const expectToBeAccessible = async (container: HTMLElement): Promise<void> => {
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    expect(button).toHaveAttribute('type');
    if (button.getAttribute('aria-label') === null) {
      expect(button.textContent).toBeTruthy();
    }
  });

  const inputs = container.querySelectorAll('input');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (!ariaLabel && !ariaLabelledBy) {
      expect(id).toBeTruthy();
      if (id) {
        expect(container.querySelector(`label[for="${id}"]`)).toBeTruthy();
      }
    }
  });
};

// Performance testing helpers
export const measureRenderTime = async (
  renderFn: () => RenderResult
): Promise<{ result: RenderResult; renderTime: number }> => {
  const start = performance.now();
  const result = renderFn();
  const end = performance.now();
  
  return {
    result,
    renderTime: end - start,
  };
};

// Export everything including the custom render
export * from '@testing-library/react';
export { customRender as render };
export { userEvent } from '@testing-library/user-event';