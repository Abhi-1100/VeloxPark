import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <>
            <div className="background-grid"></div>
            <div className="home-container">
                <div className="home-header">
                    <h1 className="home-logo">Smart Parking</h1>
                    <p className="home-tagline">Modern Parking Management System</p>
                </div>

                <div className="home-cards">
                    <Link to="/user" className="home-card">
                        <div className="card-icon">🚗</div>
                        <h2 className="card-title">User Panel</h2>
                        <p className="card-description">
                            Check your parking status, view duration, and make payments
                        </p>
                        <div className="card-button">Enter →</div>
                    </Link>

                    <Link to="/admin" className="home-card">
                        <div className="card-icon">⚙️</div>
                        <h2 className="card-title">Admin Dashboard</h2>
                        <p className="card-description">
                            Manage parking records, view statistics, and export reports
                        </p>
                        <div className="card-button">Login →</div>
                    </Link>
                </div>

                <div className="home-features">
                    <div className="feature">
                        <div className="feature-icon">⚡</div>
                        <div className="feature-text">Real-time Updates</div>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">💳</div>
                        <div className="feature-text">UPI Payments</div>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">📊</div>
                        <div className="feature-text">Analytics Dashboard</div>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">📱</div>
                        <div className="feature-text">Mobile Friendly</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
