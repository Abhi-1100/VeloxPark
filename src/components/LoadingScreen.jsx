import './LoadingScreen.css';
import ParkingSlotCarAnimation from './ParkingSlotCarAnimation';

const LoadingScreen = ({ statusText = "SYSTEM: INITIALIZING..." }) => (
    <div className="ls-root">
        {/* Ambient Grid Overlay */}
        <div className="ls-grid-stitch" />
        
        {/* Visual Texture Layers */}
        <div className="ls-texture-overlay">
            <div className="ls-tonal-shift" />
            <div className="ls-scanlines" />
        </div>

        <main className="ls-main-container">
            {/* Autonomous Parking Centerpiece */}
            <div className="ls-parking-stage">
                <ParkingSlotCarAnimation slotName="BAY A-01" />
            </div>

            {/* Branding */}
            <div className="ls-branding-wrap">
                <h1 className="ls-title">
                    <span className="ls-velox">VELOX</span>
                    <span className="ls-park">PARK</span>
                </h1>
                <div className="ls-brand-sub">AUTONOMOUS URBAN MOBILITY OS</div>
            </div>

            {/* Technical Metadata / Status */}
            <div className="ls-meta-wrap">
                <div className="ls-status-line">
                    <div className="ls-status-pulse" />
                    <p className="ls-status-text">{statusText}</p>
                </div>
                <div className="ls-node-status">
                    <span>
                        <span className="material-symbols-outlined ls-sm-icon">sensors</span>
                        NODE_08_ACTIVE
                    </span>
                    <span>
                        <span className="material-symbols-outlined ls-sm-icon">bolt</span>
                        POWER_NOMINAL
                    </span>
                    <span>
                        <span className="material-symbols-outlined ls-sm-icon">shield</span>
                        PROTO_SEC_V4
                    </span>
                </div>
            </div>

            {/* Bottom Technical Strip */}
            <div className="ls-bottom-left">
                <p>
                    Autonomous Infrastructure OS<br/>
                    Build: 2024.12.08.VELOX<br/>
                    Kernel: Kinetic_Grid_v2
                </p>
            </div>
            <div className="ls-bottom-right">
                <p>Designed for Urban Mobility</p>
            </div>
        </main>
    </div>
);

export default LoadingScreen;
