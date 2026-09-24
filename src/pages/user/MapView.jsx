import { useNavigate } from 'react-router-dom';
import VeloxParkMap from '../../components/map/VeloxParkMap';
import './MapView.css';

function MapView() {
  const navigate = useNavigate();

  return (
    <main className="map-view-page">
      <button type="button" className="map-view-back" onClick={() => navigate('/dashboard')} aria-label="Back to dashboard">
        <span aria-hidden="true">←</span> Dashboard
      </button>
      <VeloxParkMap />
    </main>
  );
}

export default MapView;