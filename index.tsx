import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: 20, textAlign: 'center', fontFamily: 'sans-serif'}}>
          <h1>Something went wrong.</h1>
          <p style={{color: 'red'}}>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} style={{padding: '10px 20px', fontSize: 16}}>
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const container = document.getElementById('root');
if (container) {
  try {
    const root = createRoot(container);
    root.render(
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );
    console.log("App mounted successfully");
  } catch (e) {
    console.error("Failed to mount app", e);
    container.innerText = "Error loading app. Please check console: " + e.message;
  }
} else {
  console.error("Failed to find the root element");
}