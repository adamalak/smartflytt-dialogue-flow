/**
 * Production-grade logging service for Smartflytt application
 * Replaces console.log calls with structured logging
 */

import { LogLevel } from '@/types';

interface LogContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
  error?: Error;
}

interface LogEntry extends LogContext {
  level: LogLevel;
  message: string;
  timestamp: string;
  environment: string;
}

class Logger {
  private readonly isDevelopment = import.meta.env.DEV;
  private readonly sessionId = crypto.randomUUID();

  private createLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      environment: this.isDevelopment ? 'development' : 'production',
      sessionId: context?.sessionId || this.sessionId,
      ...context,
    };
  }

  private formatForConsole(entry: LogEntry): string {
    const { level, message, timestamp, component, action, userId } = entry;
    const parts = [
      `[${timestamp}]`,
      `[${level.toUpperCase()}]`,
      component && `[${component}]`,
      action && `[${action}]`,
      userId && `[user:${userId.substring(0, 8)}...]`,
      message,
    ].filter(Boolean);

    return parts.join(' ');
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    
    // In production, only log warn and error
    return level === 'warn' || level === 'error';
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context);

    if (this.isDevelopment) {
      // Pretty console output for development
      const formatted = this.formatForConsole(entry);
      
      switch (level) {
        case 'debug':
          console.debug(formatted, entry.metadata);
          break;
        case 'info':
          console.info(formatted, entry.metadata);
          break;
        case 'warn':
          console.warn(formatted, entry.metadata, entry.error);
          break;
        case 'error':
          console.error(formatted, entry.metadata, entry.error);
          break;
      }
    } else {
      // Structured JSON logs for production
      console.log(JSON.stringify(entry));
    }

    // Send to external logging service in production
    if (!this.isDevelopment && (level === 'warn' || level === 'error')) {
      this.sendToExternalLogger(entry);
    }
  }

  private async sendToExternalLogger(entry: LogEntry): Promise<void> {
    try {
      // In a real production app, send to service like LogRocket, Sentry, etc.
      // For now, we'll use console.error as fallback
      if (entry.level === 'error') {
        // Could send to Sentry, LogRocket, or other service
        // await fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });
      }
    } catch (error) {
      // Fallback to console if external logging fails
      console.error('Failed to send log to external service:', error);
    }
  }

  // Public logging methods
  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  // Specialized logging methods for common use cases
  userAction(action: string, userId?: string, metadata?: Record<string, unknown>): void {
    this.info(`User action: ${action}`, {
      userId,
      action,
      metadata,
      component: 'UserAction'
    });
  }

  apiCall(endpoint: string, method: string, status?: number, latency?: number): void {
    const level = status && status >= 400 ? 'warn' : 'info';
    this.log(level, `API call: ${method} ${endpoint}`, {
      component: 'API',
      metadata: { endpoint, method, status, latency }
    });
  }

  formSubmission(formName: string, success: boolean, errors?: string[]): void {
    const level = success ? 'info' : 'warn';
    this.log(level, `Form submission: ${formName}`, {
      component: 'Form',
      action: 'submit',
      metadata: { formName, success, errors }
    });
  }

  chatbotEvent(event: string, step?: string, metadata?: Record<string, unknown>): void {
    this.info(`Chatbot event: ${event}`, {
      component: 'Chatbot',
      action: event,
      metadata: { step, ...metadata }
    });
  }

  priceCalculation(volume: number, totalPrice: number, success: boolean): void {
    const level = success ? 'info' : 'warn';
    this.log(level, 'Price calculation completed', {
      component: 'PriceCalculator',
      action: 'calculate',
      metadata: { volume, totalPrice, success }
    });
  }

  adminAction(action: string, userId: string, targetId?: string): void {
    this.info(`Admin action: ${action}`, {
      component: 'Admin',
      action,
      userId,
      metadata: { targetId }
    });
  }

  // Error boundary logging
  errorBoundary(error: Error, errorInfo: { componentStack: string }): void {
    this.error('React Error Boundary caught error', {
      component: 'ErrorBoundary',
      error,
      metadata: errorInfo
    });
  }

  // Performance logging
  performance(operation: string, duration: number, metadata?: Record<string, unknown>): void {
    const level = duration > 1000 ? 'warn' : 'info'; // Warn if over 1 second
    this.log(level, `Performance: ${operation} took ${duration}ms`, {
      component: 'Performance',
      action: operation,
      metadata: { duration, ...metadata }
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Legacy console replacement (for gradual migration)
export const log = {
  debug: (message: string, ...args: unknown[]) => logger.debug(message, { metadata: { args } }),
  info: (message: string, ...args: unknown[]) => logger.info(message, { metadata: { args } }),
  warn: (message: string, ...args: unknown[]) => logger.warn(message, { metadata: { args } }),
  error: (message: string, ...args: unknown[]) => logger.error(message, { metadata: { args } }),
};

// Development helper to replace console calls
if (import.meta.env.DEV) {
  // Override console methods in development for better logging
  const originalConsole = { ...console };
  
  console.log = (...args: unknown[]) => {
    logger.debug(args[0]?.toString() || 'Debug log', { metadata: { args } });
  };
  
  console.info = (...args: unknown[]) => {
    logger.info(args[0]?.toString() || 'Info log', { metadata: { args } });
  };
  
  console.warn = (...args: unknown[]) => {
    logger.warn(args[0]?.toString() || 'Warning log', { metadata: { args } });
  };
  
  console.error = (...args: unknown[]) => {
    logger.error(args[0]?.toString() || 'Error log', { 
      metadata: { args },
      error: args[0] instanceof Error ? args[0] : undefined
    });
  };

  // Keep original methods available for debugging
  (window as any).__originalConsole = originalConsole;
}
