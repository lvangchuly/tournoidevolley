import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', padding: '32px', background: '#f8fafc', color: '#0f172a', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
            <h1 style={{ marginTop: 0 }}>Erreur de chargement</h1>
            <p>L’application a rencontré une erreur JavaScript au démarrage.</p>
            <pre style={{ whiteSpace: 'pre-wrap', background: '#0f172a', color: '#e2e8f0', padding: '16px', borderRadius: '12px', overflow: 'auto' }}>{String(this.state.error?.stack || this.state.error)}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
