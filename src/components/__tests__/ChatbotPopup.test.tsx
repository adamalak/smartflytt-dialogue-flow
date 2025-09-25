/**
 * Integration tests for ChatbotPopup component
 * Tests the main chatbot interface and user interactions
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ChatbotPopup } from '../ChatbotPopup';

// Mock the ChatbotContainer to focus on popup behavior
vi.mock('../chatbot/ChatbotContainer', () => ({
  ChatbotContainer: () => <div data-testid="chatbot-container">Chatbot Content</div>,
}));

describe('ChatbotPopup', () => {
  it('should render popup button initially', () => {
    render(<ChatbotPopup />);
    
    const button = screen.getByRole('button', { name: /öppna smartflytt chattbot/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('fixed', 'bottom-6', 'right-6');
  });

  it('should have proper accessibility attributes', () => {
    render(<ChatbotPopup />);
    
    const button = screen.getByRole('button', { name: /öppna smartflytt chattbot/i });
    expect(button).toHaveAttribute('aria-label', 'Öppna Smartflytt chattbot');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    
    const skipLink = screen.getByRole('link', { name: /hoppa till huvudinnehåll/i });
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('should open popup when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatbotPopup />);
    
    const button = screen.getByRole('button', { name: /öppna smartflytt chattbot/i });
    
    // Initially popup should not be visible
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    // Click to open
    await user.click(button);
    
    // Popup should now be visible
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'chatbot-title');
    
    // Button aria-expanded should be updated
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('should display proper popup content when opened', async () => {
    const user = userEvent.setup();
    render(<ChatbotPopup />);
    
    const button = screen.getByRole('button', { name: /öppna smartflytt chattbot/i });
    await user.click(button);
    
    // Check dialog content
    expect(screen.getByText('Smartflytt AI-Assistent')).toBeInTheDocument();
    expect(screen.getByText('Få en preliminär offert för din flytt')).toBeInTheDocument();
    expect(screen.getByTestId('chatbot-container')).toBeInTheDocument();
    
    // Check close button
    const closeButton = screen.getByRole('button', { name: /stäng chattbot/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should close popup when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatbotPopup />);
    
    // Open popup
    const openButton = screen.getByRole('button', { name: /öppna smartflytt chattbot/i });
    await user.click(openButton);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Close popup
    const closeButton = screen.getByRole('button', { name: /stäng chattbot/i });
    await user.click(closeButton);
    
    // Popup should be closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(openButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('should toggle popup state correctly', async () => {
    const user = userEvent.setup();
    render(<ChatbotPopup />);
    
    const button = screen.getByRole('button', { name: /öppna smartflytt chattbot/i });
    
    // Initial state - closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
    
    // Open
    await user.click(button);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'true');
    
    // Close using close button
    const closeButton = screen.getByRole('button', { name: /stäng chattbot/i });
    await user.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
    
    // Open again
    await user.click(button);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('should handle keyboard navigation properly', async () => {
    const user = userEvent.setup();
    render(<ChatbotPopup />);
    
    const button = screen.getByRole('button', { name: /öppna smartflytt chattbot/i });
    
    // Focus the button and activate with Enter
    button.focus();
    await user.keyboard('{Enter}');
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    
    // Should be able to focus and activate close button with keyboard
    const closeButton = screen.getByRole('button', { name: /stäng chattbot/i });
    closeButton.focus();
    await user.keyboard('{Enter}');
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should apply correct CSS classes for styling', async () => {
    const user = userEvent.setup();
    render(<ChatbotPopup />);
    
    const button = screen.getByRole('button', { name: /öppna smartflytt chattbot/i });
    
    // Check button styling classes
    expect(button).toHaveClass(
      'fixed', 'bottom-6', 'right-6', 'z-40', 
      'w-16', 'h-16', 'rounded-full', 
      'btn-gradient-primary'
    );
    
    // Open popup
    await user.click(button);
    
    const dialog = screen.getByRole('dialog');
    
    // Check dialog container classes
    expect(dialog).toHaveClass(
      'fixed', 'inset-0', 'z-50', 
      'flex', 'items-center', 'justify-center'
    );
    
    // Check card classes
    const card = dialog.querySelector('.glass-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('w-full', 'max-w-2xl', 'h-[600px]');
  });

  it('should have proper semantic HTML structure', async () => {
    const user = userEvent.setup();
    render(<ChatbotPopup />);
    
    // Open popup
    const button = screen.getByRole('button', { name: /öppna smartflytt chattbot/i });
    await user.click(button);
    
    // Check semantic structure
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('role', 'dialog');
    expect(dialog.querySelector('#chatbot-title')).toBeInTheDocument();
    expect(dialog.querySelector('#main-content')).toBeInTheDocument();
    
    // Check heading hierarchy
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Smartflytt AI-Assistent');
    expect(heading).toHaveAttribute('id', 'chatbot-title');
  });

  it('should maintain focus management', async () => {
    const user = userEvent.setup();
    render(<ChatbotPopup />);
    
    const button = screen.getByRole('button', { name: /öppna smartflytt chattbot/i });
    
    // Focus button and open popup
    button.focus();
    expect(document.activeElement).toBe(button);
    
    await user.click(button);
    
    // After opening, focus should still be manageable
    const closeButton = screen.getByRole('button', { name: /stäng chattbot/i });
    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);
  });

  it('should not render popup content when closed', () => {
    render(<ChatbotPopup />);
    
    // Only the trigger button should be rendered
    expect(screen.getByRole('button', { name: /öppna smartflytt chattbot/i })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Smartflytt AI-Assistent')).not.toBeInTheDocument();
    expect(screen.queryByTestId('chatbot-container')).not.toBeInTheDocument();
  });
});