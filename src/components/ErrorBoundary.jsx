import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white p-8 text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong.</h1>
          <p className="text-gray-400 mb-8 max-w-md">
            The application encountered a critical error. Please inspect the console for more details.
          </p>
          <div className="bg-black/30 p-4 rounded-xl border border-white/10 text-left overflow-auto max-w-2xl w-full max-h-96">
            <code className="text-red-400 text-xs font-mono">
              {this.state.error && this.state.error.toString()}
            </code>
            <br />
            <br />
            <code className="text-gray-500 text-xs font-mono whitespace-pre-wrap">
               {this.state.errorInfo && this.state.errorInfo.componentStack}
            </code>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all"
          >
            Refresh Application
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
