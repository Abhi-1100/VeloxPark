import React from 'react';
import { Typing } from '@/components/ui/typing';
import './LoadingScreen.css';

const LoadingScreen = ({ statusText = "Loading..." }) => {
  return (
    <div className="ls-root" role="status" aria-live="polite">
      {/* Subtle radial ambient background glow */}
      <div className="ls-ambient-glow" />

      <main className="ls-content">
        {/* VeloxPark Mark */}
        <div className="ls-brand-container">
          <div className="ls-logo-badge">
            <img 
              src="/brand/digital/veloxpark-app-icon.svg" 
              alt="VeloxPark" 
              className="ls-app-icon" 
            />
          </div>
          <div className="ls-brand-text">
            <span className="ls-brand-velox">VELOX</span>
            <span className="ls-brand-park">PARK</span>
          </div>
        </div>

        {/* Minimal Typing Indicator + Status */}
        <div className="ls-status-pill">
          <Typing 
            className="ls-typing-dots" 
            dots={3}
          />
          <span className="ls-status-label">{statusText}</span>
        </div>
      </main>

      {/* Clean minimal footer */}
      <footer className="ls-footer">
        <span>VeloxPark Smart Parking Network</span>
      </footer>
    </div>
  );
};

export default LoadingScreen;
