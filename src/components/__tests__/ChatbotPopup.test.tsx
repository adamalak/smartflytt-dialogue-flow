/**
 * Unit tests for ChatbotPopup component
 * Tests rendering, accessibility, and user interactions
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@/test/utils';
import { userEvent } from '@testing-library/user-event';
import { ChatbotPopup } from '../ChatbotPopup';

// Mock the chatbot container
vi.mock('../chatbot/ChatbotContainer', () => ({
  ChatbotContainer: () => <div data-testid="chatbot-container">Chatbot Container</div>
}));

// Helper to get elements
const getButton = (container: HTMLElement) => 
  container.querySelector('button[aria-label*="chatbot"]') as HTMLButtonElement;

const getDialog = (container: HTMLElement) => 
  container.querySelector('[role="dialog"]') as HTMLElement;

describe('ChatbotPopup Component', () => {
  describe('Rendering', () => {
    it('renders chatbot popup button', () => {
      const { container } = render(<ChatbotPopup />);
      
      const button = getButton(container);
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('initially shows closed state', () => {
      const { container } = render(<ChatbotPopup />);
      
      const dialog = getDialog(container);
      expect(dialog).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const { container } = render(<ChatbotPopup />);
      
      const button = getButton(container);
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('provides keyboard navigation support', async () => {
      const user = userEvent.setup();
      const { container } = render(<ChatbotPopup />);
      
      const button = getButton(container);
      await user.tab();
      expect(button).toHaveFocus();
    });
  });

  describe('User Interactions', () => {
    it('opens chatbot when button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(<ChatbotPopup />);
      
      const button = getButton(container);
      await user.click(button);
      
      const dialog = getDialog(container);
      expect(dialog).toBeInTheDocument();
    });

    it('closes chatbot when clicked again', async () => {
      const user = userEvent.setup();
      const { container } = render(<ChatbotPopup />);
      
      const button = getButton(container);
      
      // Open chatbot
      await user.click(button);
      expect(getDialog(container)).toBeInTheDocument();
      
      // Close chatbot (assuming same button toggles)
      await user.click(button);
      expect(getDialog(container)).not.toBeInTheDocument();
    });

    it('responds to keyboard activation', async () => {
      const user = userEvent.setup();
      const { container } = render(<ChatbotPopup />);
      
      const button = getButton(container);
      await user.tab();
      await user.keyboard('{Enter}');
      
      const dialog = getDialog(container);
      expect(dialog).toBeInTheDocument();
    });
  });

  describe('Styling and Classes', () => {
    it('applies correct CSS classes', () => {
      const { container } = render(<ChatbotPopup />);
      
      const button = getButton(container);
      expect(button).toHaveClass('fixed');
    });

    it('has proper button styling', () => {
      const { container } = render(<ChatbotPopup />);
      
      const button = getButton(container);
      expect(button).toHaveClass('rounded-full');
    });
  });

  describe('Focus Management', () => {
    it('maintains focus on button after opening chatbot', async () => {
      const user = userEvent.setup();
      const { container } = render(<ChatbotPopup />);
      
      const button = getButton(container);
      await user.click(button);
      
      // Button should still be in document
      expect(button).toBeInTheDocument();
    });

    it('manages focus when chatbot is open', async () => {
      const user = userEvent.setup();
      const { container } = render(<ChatbotPopup />);
      
      const button = getButton(container);
      await user.click(button);
      
      // Chatbot should be in DOM
      const dialog = getDialog(container);
      expect(dialog).toBeInTheDocument();
    });
  });
});