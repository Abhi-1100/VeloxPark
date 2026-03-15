/**
 * LoadingScreen.jsx
 * -----------------
 * Branded full-screen loading animation for VeloxPark.
 * Shown while Firebase auth state is being determined on first load.
 * Uses pure CSS keyframe animations — no external dependencies.
 */

import './LoadingScreen.css';

const LoadingScreen = () => (
    <div className="ls-root">
        {/* Subtle grid background */}
        <div className="ls-grid" />

        <div className="ls-center">
            {/* Animated ring */}
            <div className="ls-ring-wrap">
                <div className="ls-ring" />
                <div className="ls-ring ls-ring-2" />
                {/* Inner icon */}
                <div className="ls-icon">
                    <span className="material-symbols-outlined">local_parking</span>
                </div>
            </div>

            {/* Brand name */}
            <div className="ls-brand">
                <span className="ls-brand-velox">VELOX</span>
                <span className="ls-brand-park">PARK</span>
            </div>

            {/* Animated dots */}
            <div className="ls-dots">
                <span className="ls-dot" />
                <span className="ls-dot ls-dot-2" />
                <span className="ls-dot ls-dot-3" />
            </div>
        </div>
    </div>
);

export default LoadingScreen;
