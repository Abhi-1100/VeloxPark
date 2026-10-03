import React, { useEffect, useState } from 'react';
import './ParkingSlotCarAnimation.css';

/**
 * ParkingSlotCarAnimation
 * Custom illustrated autonomous vehicle parking into a smart slot loader.
 * Designed specifically for VeloxPark's dark luxury kinetic grid aesthetic.
 */
const ParkingSlotCarAnimation = ({ slotName = 'BAY A-01' }) => {
    const [cycleStep, setCycleStep] = useState(0);

    // Sync telemetry readouts with the 5.2s CSS parking animation cycle
    useEffect(() => {
        const updateCycle = () => {
            const now = Date.now();
            const elapsed = (now % 5200) / 5200;

            if (elapsed < 0.22) {
                setCycleStep(0); // Approaching & Seeking
            } else if (elapsed < 0.52) {
                setCycleStep(1); // Turning & Steering
            } else if (elapsed < 0.72) {
                setCycleStep(2); // In-Slot Deceleration
            } else {
                setCycleStep(3); // Locked & Parked
            }
        };

        const interval = setInterval(updateCycle, 150);
        updateCycle();
        return () => clearInterval(interval);
    }, []);

    const telemetryData = [
        { status: 'SEEKING OPEN BAY', angle: '00.0°', dist: '8.4 m', stateClass: '' },
        { status: 'AUTOPARK // STEERING', angle: '-42.0°', dist: '3.6 m', stateClass: '' },
        { status: 'ALIGNING IN BAY', angle: '-90.0°', dist: '1.1 m', stateClass: '' },
        { status: 'BAY LOCKED // PARKED', angle: '-90.0°', dist: '0.00 m', stateClass: 'is-locked' }
    ];

    const currentTelemetry = telemetryData[cycleStep];

    return (
        <div className="psca-container">
            <svg 
                viewBox="0 0 460 250" 
                className="psca-svg" 
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Autonomous Car Parking in Slot Illustration"
            >
                <defs>
                    {/* Headlight beam projection gradient */}
                    <linearGradient id="psca-beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f5c518" stopOpacity="0.45" />
                        <stop offset="35%" stopColor="#f5c518" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#f5c518" stopOpacity="0" />
                    </linearGradient>

                    {/* Car metallic chassis gradient */}
                    <linearGradient id="psca-body-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1e1c14" />
                        <stop offset="30%" stopColor="#2e2b1d" />
                        <stop offset="70%" stopColor="#252317" />
                        <stop offset="100%" stopColor="#181711" />
                    </linearGradient>

                    {/* Smoked glass canopy gradient */}
                    <linearGradient id="psca-glass-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#12181d" stopOpacity="0.95" />
                        <stop offset="60%" stopColor="#1c252d" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#10151a" stopOpacity="0.95" />
                    </linearGradient>

                    {/* Velox Gold metallic trim */}
                    <linearGradient id="psca-gold-trim" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f5c518" />
                        <stop offset="50%" stopColor="#ffe779" />
                        <stop offset="100%" stopColor="#d19c00" />
                    </linearGradient>

                    {/* Hazard warning stripes for wheel bumper */}
                    <pattern id="psca-hazard-stripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="4" height="8" fill="#f5c518" />
                        <rect x="4" width="4" height="8" fill="#181711" />
                    </pattern>

                    {/* Radial parking stall glow */}
                    <radialGradient id="psca-bay-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#f5c518" stopOpacity="0.08" />
                        <stop offset="80%" stopColor="#f5c518" stopOpacity="0.01" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* ── Ground / Tarmac Layer ── */}
                <rect x="0" y="0" width="460" height="250" fill="#0d0c08" rx="8" />

                {/* Ambient Floor Grid Lines */}
                <g stroke="#262319" strokeWidth="0.75" strokeDasharray="3 6" opacity="0.6">
                    <line x1="0" y1="50" x2="460" y2="50" />
                    <line x1="0" y1="100" x2="460" y2="100" />
                    <line x1="0" y1="150" x2="460" y2="150" />
                    <line x1="115" y1="0" x2="115" y2="150" />
                    <line x1="345" y1="0" x2="345" y2="150" />
                </g>

                {/* ── Lane / Driveway Zone (Bottom) ── */}
                <rect x="0" y="152" width="460" height="98" fill="#11100b" />
                <line x1="0" y1="152" x2="460" y2="152" stroke="#3a372b" strokeWidth="1.5" />

                {/* Road center dashed line */}
                <line 
                    x1="0" 
                    y1="202" 
                    x2="460" 
                    y2="202" 
                    stroke="#f5c518" 
                    strokeWidth="1.5" 
                    strokeDasharray="14 12" 
                    opacity="0.3" 
                />

                {/* Road pavement directional arrow */}
                <g transform="translate(85, 202)" opacity="0.25">
                    <line x1="-14" y1="0" x2="14" y2="0" stroke="#e7e2d9" strokeWidth="2" strokeLinecap="round" />
                    <polyline points="8,-5 14,0 8,5" fill="none" stroke="#e7e2d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>

                {/* ── Parking Bays Layer (Top) ── */}
                {/* Neighbor Bay Left: BAY A-00 (Muted) */}
                <g opacity="0.28">
                    <rect x="75" y="16" width="76" height="124" fill="none" stroke="#504c3c" strokeWidth="1" strokeDasharray="4 4" rx="2" />
                    <text x="113" y="32" textAnchor="middle" fill="#9a9078" fontSize="8" fontFamily="'JetBrains Mono', monospace" letterSpacing="1">A-00</text>
                    <circle cx="113" cy="78" r="12" fill="none" stroke="#504c3c" strokeWidth="1" />
                    <text x="113" y="82" textAnchor="middle" fill="#9a9078" fontSize="10" fontFamily="'Space Grotesk', sans-serif" fontWeight="700">P</text>
                </g>

                {/* Neighbor Bay Right: BAY A-02 (Muted) */}
                <g opacity="0.28">
                    <rect x="309" y="16" width="76" height="124" fill="none" stroke="#504c3c" strokeWidth="1" strokeDasharray="4 4" rx="2" />
                    <text x="347" y="32" textAnchor="middle" fill="#9a9078" fontSize="8" fontFamily="'JetBrains Mono', monospace" letterSpacing="1">A-02</text>
                    <circle cx="347" cy="78" r="12" fill="none" stroke="#504c3c" strokeWidth="1" />
                    <text x="347" y="82" textAnchor="middle" fill="#9a9078" fontSize="10" fontFamily="'Space Grotesk', sans-serif" fontWeight="700">P</text>
                </g>

                {/* ── Active Target Bay: BAY A-01 (Centerpiece) ── */}
                {/* Stall ambient floor glow */}
                <ellipse cx="230" cy="80" rx="48" ry="60" fill="url(#psca-bay-glow)" />

                {/* Main Bay Stall Boundary Lines */}
                <line x1="184" y1="16" x2="184" y2="140" stroke="#f5c518" strokeWidth="1.5" strokeOpacity="0.8" />
                <line x1="276" y1="16" x2="276" y2="140" stroke="#f5c518" strokeWidth="1.5" strokeOpacity="0.8" />

                {/* High-tech Corner Brackets on Target Bay */}
                <g className="psca-bay-brackets" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 184,30 L 184,16 L 198,16" />
                    <path d="M 262,16 L 276,16 L 276,30" />
                    <path d="M 184,126 L 184,140 L 198,140" />
                    <path d="M 262,140 L 276,140 L 276,126" />
                </g>

                {/* Front Wheel Stop Curb (with hazard warning stripes) */}
                <rect x="198" y="24" width="64" height="8" rx="2" fill="url(#psca-hazard-stripes)" stroke="#f5c518" strokeWidth="1" />

                {/* Parking Bay Ground Stencil Badge */}
                <g opacity="0.65">
                    <text x="230" y="44" textAnchor="middle" fill="#f5c518" fontSize="8" fontFamily="'JetBrains Mono', monospace" fontWeight="600" letterSpacing="1.5">
                        {slotName}
                    </text>
                    {/* Parking 'P' Symbol Stamp */}
                    <circle cx="230" cy="118" r="11" fill="none" stroke="#f5c518" strokeWidth="1.2" strokeDasharray="3 2" />
                    <text x="230" y="122" textAnchor="middle" fill="#f5c518" fontSize="10" fontFamily="'Space Grotesk', sans-serif" fontWeight="800">P</text>
                </g>

                {/* Center Docking Alignment Reticle */}
                <g className="psca-dock-reticle" fill="none" strokeWidth="1.2">
                    <circle cx="230" cy="80" r="18" strokeDasharray="4 3" />
                    <circle cx="230" cy="80" r="4" fill="none" />
                    <line x1="206" y1="80" x2="216" y2="80" />
                    <line x1="244" y1="80" x2="254" y2="80" />
                    <line x1="230" y1="56" x2="230" y2="66" />
                    <line x1="230" y1="94" x2="230" y2="104" />
                </g>

                {/* Bay Status Indicator Dot */}
                <circle cx="230" cy="16" r="3" className="psca-bay-status-dot" />

                {/* ── Trajectory Guidance Laser Line ── */}
                <path 
                    d="M 110,202 L 155,202 Q 200,202 218,165 Q 230,135 230,80" 
                    fill="none" 
                    stroke="#38bdf8" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    className="psca-trajectory-path"
                />

                {/* ── The Autonomous Car Assembly ── */}
                <g className="psca-car-assembly">
                    {/* Headlight Cones (projected onto road ahead of the car) */}
                    <g className="psca-headlight-beams">
                        {/* Right Headlight Beam (relative to car heading) */}
                        <polygon points="36,-11 115,-34 115,2 36,-5" fill="url(#psca-beam-grad)" />
                        {/* Left Headlight Beam */}
                        <polygon points="36,11 115,34 115,-2 36,5" fill="url(#psca-beam-grad)" />
                    </g>

                    {/* Performance Tires (4 Wheels) */}
                    {/* Front-Left Tire */}
                    <rect x="14" y="-22" width="16" height="5.5" rx="2" fill="#12110c" stroke="#484435" strokeWidth="0.75" />
                    {/* Front-Right Tire */}
                    <rect x="14" y="16.5" width="16" height="5.5" rx="2" fill="#12110c" stroke="#484435" strokeWidth="0.75" />
                    {/* Rear-Left Tire */}
                    <rect x="-28" y="-22" width="16" height="5.5" rx="2" fill="#12110c" stroke="#484435" strokeWidth="0.75" />
                    {/* Rear-Right Tire */}
                    <rect x="-28" y="16.5" width="16" height="5.5" rx="2" fill="#12110c" stroke="#484435" strokeWidth="0.75" />

                    {/* Main Sculpted Sports EV Chassis */}
                    <path 
                        d="M -36,-14 C -36,-18 -32,-19 -22,-19 L 14,-19 C 22,-19 28,-18 34,-13 L 38,-7 C 40,-2 40,2 38,7 L 34,13 C 28,18 22,19 14,19 L -22,19 C -32,19 -36,18 -36,14 C -38,9 -38,-9 -36,-14 Z" 
                        fill="url(#psca-body-grad)" 
                        stroke="#f5c518" 
                        strokeWidth="1.2" 
                    />

                    {/* Side Aero Skirt Accents */}
                    <line x1="-18" y1="-19" x2="10" y2="-19" stroke="url(#psca-gold-trim)" strokeWidth="1.5" />
                    <line x1="-18" y1="19" x2="10" y2="19" stroke="url(#psca-gold-trim)" strokeWidth="1.5" />

                    {/* Hood Aero Scoop Lines */}
                    <path d="M 18,-8 L 32,-4" stroke="#f5c518" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
                    <path d="M 18,8 L 32,4" stroke="#f5c518" strokeWidth="1" strokeLinecap="round" opacity="0.7" />

                    {/* Smoked Panoramic Glass Canopy & Cabin */}
                    <path 
                        d="M -16,-13 C -16,-13 -4,-14 6,-14 C 18,-14 24,-11 26,-7 C 27,-2 27,2 26,7 C 24,11 18,14 6,14 C -4,14 -16,13 -16,13 C -19,10 -20,-10 -16,-13 Z" 
                        fill="url(#psca-glass-grad)" 
                        stroke="#3a372b" 
                        strokeWidth="1" 
                    />

                    {/* Glass Glare Highlight */}
                    <path d="M -10,-10 L 14,-10 C 20,-10 22,-8 23,-5" fill="none" stroke="#6b7280" strokeWidth="0.8" opacity="0.5" />

                    {/* Front Twin LED Projectors */}
                    <rect x="36" y="-12" width="2.5" height="5" rx="1" fill="#ffffff" filter="drop-shadow(0 0 2px #fff)" />
                    <rect x="36" y="7" width="2.5" height="5" rx="1" fill="#ffffff" filter="drop-shadow(0 0 2px #fff)" />

                    {/* Flashing Left Turn Signal (Amber LED) */}
                    <circle cx="36" cy="-14" r="2.2" fill="#f59e0b" className="psca-turn-signal-left" filter="drop-shadow(0 0 4px #f59e0b)" />
                    <circle cx="-34" cy="-14" r="2" fill="#f59e0b" className="psca-turn-signal-left" filter="drop-shadow(0 0 4px #f59e0b)" />

                    {/* Rear Cyber Lightbar & Dynamic Brake Lights */}
                    {/* Brake Glow Overlay */}
                    <rect x="-42" y="-16" width="10" height="32" rx="4" fill="#ff2222" filter="blur(4px)" className="psca-brake-glow" />
                    {/* Taillight Strip */}
                    <path d="M -36,-13 L -36,13" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" className="psca-brake-light" />

                    {/* Autonomous Roof LiDAR Scanner */}
                    <g transform="translate(2, 0)">
                        {/* Concentric sonar laser rings */}
                        <circle cx="0" cy="0" r="3" fill="none" stroke="#38bdf8" className="psca-lidar-ring" />
                        <circle cx="0" cy="0" r="3" fill="none" stroke="#38bdf8" className="psca-lidar-ring-delayed" />
                        {/* Center dome puck */}
                        <circle cx="0" cy="0" r="3.2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                        <circle cx="0" cy="0" r="1.4" fill="#38bdf8" />
                    </g>
                </g>
            </svg>

            {/* ── Live HUD Telemetry Strip ── */}
            <div className="psca-hud-bar">
                <div className="psca-hud-col">
                    <span className="psca-hud-label">OS Telemetry</span>
                    <span className={`psca-hud-value ${currentTelemetry.stateClass}`}>
                        <span className="psca-hud-indicator" />
                        {currentTelemetry.status}
                    </span>
                </div>
                <div className="psca-hud-col" style={{ textAlign: 'center' }}>
                    <span className="psca-hud-label">Steering</span>
                    <span className="psca-hud-value" style={{ justifyContent: 'center' }}>
                        {currentTelemetry.angle}
                    </span>
                </div>
                <div className="psca-hud-col" style={{ textAlign: 'right' }}>
                    <span className="psca-hud-label">Proximity</span>
                    <span className={`psca-hud-value ${currentTelemetry.stateClass}`} style={{ justifyContent: 'flex-end' }}>
                        {currentTelemetry.dist}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ParkingSlotCarAnimation;
