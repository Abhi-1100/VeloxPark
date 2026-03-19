import React from 'react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree and displays a fallback UI
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details to console for debugging
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);

    // TODO: Send error to monitoring service (e.g., Sentry, LogRocket)
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#f1f5f9',
          padding: '40px',
          textAlign: 'center',
          fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}>
          <div style={{
            background: '#161616',
            border: '1px solid #ff3366',
            borderRadius: '12px',
            padding: '48px',
            maxWidth: '600px',
            boxShadow: '0 20px 60px rgba(255, 51, 102, 0.15)'
          }}>
            {/* Error Icon */}
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 24px',
              background: 'rgba(255, 51, 102, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              ⚠️
            </div>

            {/* Heading */}
            <h1 style={{
              fontSize: '28px',
              fontWeight: 700,
              marginBottom: '16px',
              color: '#f1f5f9',
              letterSpacing: '-0.02em'
            }}>
              Something went wrong
            </h1>

            {/* Error Message */}
            <p style={{
              color: '#94a3b8',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '32px',
              fontFamily: "'Space Mono', monospace"
            }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Reload Button */}
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '14px 28px',
                  background: '#f9d006',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(249, 208, 6, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(249, 208, 6, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(249, 208, 6, 0.3)';
                }}
              >
                Reload Application
              </button>

              {/* Go Home Button */}
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '14px 28px',
                  background: 'transparent',
                  color: '#f9d006',
                  border: '1px solid #f9d006',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(249, 208, 6, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Go to Home
              </button>
            </div>

            {/* Debug Info (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginTop: '32px',
                textAlign: 'left',
                background: '#0a0a0a',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#94a3b8',
                fontFamily: "'Space Mono', monospace"
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '8px', color: '#f9d006' }}>
                  Show Error Details
                </summary>
                <pre style={{
                  margin: 0,
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>

          {/* Footer */}
          <p style={{
            marginTop: '32px',
            fontSize: '14px',
            color: '#64748b',
            fontFamily: "'Space Mono', monospace"
          }}>
            VeloxPark OS • If this persists, please contact support
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
