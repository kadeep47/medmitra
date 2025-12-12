import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('[DEBUG] index.tsx: Module loaded', { reactVersion: React?.version, hasCreateRoot: typeof createRoot !== 'undefined' });
// #region agent log
fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:4',message:'Module loaded',data:{reactVersion:React?.version,hasCreateRoot:typeof createRoot!=='undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:15',message:'ErrorBoundary caught error',data:{error:error?.message,errorType:error?.constructor?.name,componentStack:errorInfo?.componentStack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
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

// #region agent log
fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:36',message:'App initialization started',data:{hasContainer:!!document.getElementById('root')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion
const container = document.getElementById('root');
console.log('[DEBUG] index.tsx: Root container check', { hasContainer: !!container });
if (container) {
  try {
    console.log('[DEBUG] index.tsx: Creating React root');
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:40',message:'Creating React root',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const root = createRoot(container);
    root.render(
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:45',message:'App mounted successfully',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    console.log('[DEBUG] index.tsx: App mounted successfully');
  } catch (e) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:47',message:'Failed to mount app',data:{error:e?.message,errorType:e?.constructor?.name,stack:e?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    console.error("Failed to mount app", e);
    console.error("Error details:", {message: e?.message, name: e?.name, stack: e?.stack});
    container.innerText = "Error loading app. Please check console: " + (e?.message || 'Unknown error');
  }
} else {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/126bd026-08bb-4d79-88fd-b3f124d82bcb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'index.tsx:51',message:'Root element not found',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  console.error("Failed to find the root element");
}