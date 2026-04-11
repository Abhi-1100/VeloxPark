import './LoadingScreen.css';

const LoadingScreen = () => (
    <div className="ls-root">
        {/* Ambient Grid Overlay from Stitch */}
        <div className="ls-grid-stitch" />
        
        {/* Visual Texture Layers */}
        <div className="ls-texture-overlay">
            <div className="ls-tonal-shift" />
            <div className="ls-grain" />
        </div>

        <main className="ls-main-container">
            {/* Kinetic Grid Centerpiece */}
            <div className="ls-kinetic-centerpiece">
                {/* Road Container */}
                <div className="ls-road-container">
                    <div className="ls-animate-road" />
                </div>
                
                {/* Car Icon Animation */}
                <div className="ls-animate-drive">
                    <img 
                      alt="Autonomous Car" 
                      className="ls-car-img" 
                      src="https://lh3.googleusercontent.com/aida/ADBb0ugmljvOgfG2ayO1_DjHxDOoPpiDJgPTdnls0zrqIZHak-AwheqKj9xkwDIVu6txzQiaYIQO9B5W2DmpF16SgWKo5WLfPACi5OC7F9Ss30GuMptuY3CDnYUNoG4GQXS4BAJM7rU54JswpJHonlbkFILtENdhGy65_avsufEVcz0O63xUGG53ih9eWTy8J29iIKAMg_Jao-mDHtjAS1Y0tCeBnTApqrnfCILztS_RTXG2NNoXegDyhnb_-dMN28MR8vwMX_SvBhB4Zzw" 
                    />
                    {/* Headlight Glow Effect */}
                    <div className="ls-headlight-glow" />
                </div>
            </div>

            {/* Branding */}
            <div className="ls-branding-wrap">
                <h1 className="ls-title">
                    <span className="ls-velox">VELOX</span>
                    <span className="ls-park">PARK</span>
                </h1>
            </div>

            {/* Technical Metadata / Status */}
            <div className="ls-meta-wrap">
                <div className="ls-status-line">
                    <div className="ls-status-pulse" />
                    <p className="ls-status-text">SYSTEM: INITIALIZING...</p>
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
