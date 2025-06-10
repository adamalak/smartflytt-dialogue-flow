
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { SMARTFLYTT_CONFIG } from '@/data/constants';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Chatbot error:', error, errorInfo);
  }

  private handleRestart = () => {
    // Clear localStorage and reload
    localStorage.removeItem('smartflytt-chat-state');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex items-center justify-center p-8">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Något gick fel
              </h2>
              <p className="text-gray-600 mb-6">
                Ett oväntat fel uppstod. Försök starta om chatten eller kontakta oss direkt.
              </p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={this.handleRestart}
                className="w-full bg-smartflytt-600 hover:bg-smartflytt-700"
              >
                Starta om chatten
              </Button>
              <div className="text-sm text-gray-500">
                <p>Eller kontakta oss direkt:</p>
                <p className="font-medium">{SMARTFLYTT_CONFIG.COMPANY.phone}</p>
                <p className="font-medium">{SMARTFLYTT_CONFIG.COMPANY.email}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
