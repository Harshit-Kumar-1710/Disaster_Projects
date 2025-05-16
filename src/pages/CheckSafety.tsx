import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, AlertCircle, Info, MapPin, ScanLine } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import { generateDemoCity, Graph, Node } from '../utils/dijkstra';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icon issues in Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapSetViewProps {
  coordinates: [number, number];
}

// Component to set the map view on load
const MapSetView: React.FC<MapSetViewProps> = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coordinates, 14);
  }, [coordinates, map]);
  
  return null;
};

const CheckSafety: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [cityGraph, setCityGraph] = useState<Graph | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Node | null>(null);
  const [safetyStatus, setSafetyStatus] = useState<{
    isSafe: boolean;
    dangerLevel: number;
    message: string;
    threatType?: string;
    nearestSafeLocation?: Node;
    distanceToSafety?: number;
  } | null>(null);
  
  useEffect(() => {
    // Generate the demo city and set up initial state
    const demoCity = generateDemoCity();
    setCityGraph(demoCity);
    
    // Get the user's location (stored in local storage or use a default)
    const storedLocation = localStorage.getItem('safescape_selected_location');
    let userLocation: Node;
    
    if (storedLocation) {
      userLocation = JSON.parse(storedLocation);
    } else {
      // Default to residential1 if no location is stored
      userLocation = Array.from(demoCity.nodes.values()).find(node => node.id === 'residential1') || 
                    Array.from(demoCity.nodes.values())[0];
    }
    
    setCurrentLocation(userLocation);
    
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  
  const scanSafety = async () => {
    if (!cityGraph || !currentLocation) return;
    
    setScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Find the nearest safe location
    const safeLocations = Array.from(cityGraph.nodes.values()).filter(node => node.isSafe);
    let nearestSafeLocation: Node | null = null;
    let minDistance = Infinity;
    
    safeLocations.forEach(safeNode => {
      // Calculate rough distance (this is a simplified version)
      const distance = Math.sqrt(
        Math.pow(safeNode.x - currentLocation.x, 2) + 
        Math.pow(safeNode.y - currentLocation.y, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestSafeLocation = safeNode;
      }
    });
    
    // Determine safety status
    const isSafe = currentLocation.isSafe;
    const dangerLevel = currentLocation.dangerLevel;
    
    let message = '';
    let threatType = '';
    
    if (isSafe) {
      message = 'You are in a safe location. No immediate threats detected.';
    } else if (dangerLevel <= 3) {
      message = 'Your location is relatively safe, but stay alert for any changes.';
      threatType = 'Low risk area';
    } else if (dangerLevel <= 7) {
      message = 'Your location has moderate risk. Consider moving to a safer area soon.';
      threatType = 'Moderate risk area';
    } else {
      message = 'Your location is high risk! Evacuate immediately to the nearest safe location.';
      threatType = 'High risk area';
    }
    
    setSafetyStatus({
      isSafe,
      dangerLevel,
      message,
      threatType: isSafe ? undefined : threatType,
      nearestSafeLocation: nearestSafeLocation || undefined,
      distanceToSafety: nearestSafeLocation ? minDistance : undefined
    });
    
    setScanning(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-20 pb-12 bg-gray-50">
        <div className="page-container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-blue-800 hover:text-blue-600 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </button>
              <h1 className="page-title flex items-center">
                <CheckCircle className="h-8 w-8 text-emerald-600 mr-2" />
                Check Safety Status
              </h1>
              <p className="page-subtitle">
                Verify if your current location is safe based on real-time data.
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-800 mb-4"></div>
              <p className="text-xl text-gray-600">Loading safety data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-emerald-50">
                  <h2 className="text-xl font-semibold text-emerald-900 flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2 text-emerald-600" />
                    Safety Verification
                  </h2>
                  <p className="text-emerald-700 mt-2">
                    Check if your current location is safe based on real-time data.
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Current Location</label>
                    <div className="p-3 bg-gray-100 rounded-md flex items-center">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                      <span>{currentLocation?.name || 'Unknown Location'}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={scanSafety}
                    disabled={scanning}
                    className="w-full py-4 rounded-md font-semibold text-white flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                  >
                    {scanning ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                        Scanning Area...
                      </>
                    ) : (
                      <>
                        <ScanLine className="h-5 w-5 mr-2" />
                        Scan for Safety
                      </>
                    )}
                  </button>
                  
                  {safetyStatus && (
                    <div className="mt-6">
                      <div className={`p-6 rounded-lg ${
                        safetyStatus.isSafe ? 'bg-emerald-50 border border-emerald-200' :
                        safetyStatus.dangerLevel <= 3 ? 'bg-emerald-50 border border-emerald-200' :
                        safetyStatus.dangerLevel <= 7 ? 'bg-amber-50 border border-amber-200' :
                        'bg-red-50 border border-red-200'
                      }`}>
                        <div className="flex justify-center mb-4">
                          <div className={`safety-indicator ${
                            safetyStatus.isSafe ? 'safety-safe' :
                            safetyStatus.dangerLevel <= 3 ? 'safety-safe' :
                            safetyStatus.dangerLevel <= 7 ? 'safety-warning' :
                            'safety-danger'
                          }`}>
                            {safetyStatus.isSafe ? (
                              <CheckCircle className="h-12 w-12" />
                            ) : safetyStatus.dangerLevel <= 3 ? (
                              <Info className="h-12 w-12" />
                            ) : safetyStatus.dangerLevel <= 7 ? (
                              <AlertCircle className="h-12 w-12" />
                            ) : (
                              <AlertTriangle className="h-12 w-12" />
                            )}
                          </div>
                        </div>
                        
                        <h3 className={`text-center text-xl font-bold mb-2 ${
                          safetyStatus.isSafe ? 'text-emerald-700' :
                          safetyStatus.dangerLevel <= 3 ? 'text-emerald-700' :
                          safetyStatus.dangerLevel <= 7 ? 'text-amber-700' :
                          'text-red-700'
                        }`}>
                          {safetyStatus.isSafe ? 'Safe Location' :
                           safetyStatus.dangerLevel <= 3 ? 'Mostly Safe' :
                           safetyStatus.dangerLevel <= 7 ? 'Caution Advised' :
                           'Danger - Evacuation Recommended'}
                        </h3>
                        
                        {safetyStatus.threatType && (
                          <div className="text-center mb-3 text-sm font-medium bg-gray-100 py-1 px-3 rounded-full inline-block">
                            {safetyStatus.threatType}
                          </div>
                        )}
                        
                        <p className="text-gray-700 mb-4">
                          {safetyStatus.message}
                        </p>
                        
                        {safetyStatus.nearestSafeLocation && !safetyStatus.isSafe && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-md">
                            <h4 className="font-medium text-blue-800 mb-1">Nearest Safe Location:</h4>
                            <p className="text-blue-700">{safetyStatus.nearestSafeLocation.name}</p>
                            <p className="text-sm text-blue-600 mt-1">
                              Approx. {Math.round(safetyStatus.distanceToSafety || 0)} meters away
                            </p>
                            <button
                              onClick={() => navigate('/sos')}
                              className="w-full mt-3 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              Get Directions
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Safety Map</h2>
                  <p className="text-gray-600">
                    View safety zones and danger areas around your location.
                  </p>
                </div>
                
                <div className="h-[500px] relative">
                  <MapContainer 
                    style={{ height: '100%', width: '100%' }}
                    center={[30.3165, 78.0322]}
                    zoom={13} 
                    scrollWheelZoom={true}
                  >
                    <MapSetView coordinates={[30.3165, 78.0322]} />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {cityGraph && Array.from(cityGraph.nodes.values()).map((node) => (
                      <Marker 
                        key={node.id}
                        position={[node.lat || 30.3165, node.lng || 78.0322]}
                        icon={
                          currentLocation?.id === node.id ?
                          L.divIcon({
                            className: 'custom-marker',
                            html: `<div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">You</div>`,
                            iconSize: [24, 24],
                            iconAnchor: [12, 12]
                          }) :
                          node.isSafe ? 
                          L.divIcon({
                            className: 'custom-marker',
                            html: `<div class="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>`,
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                          }) : 
                          L.divIcon({
                            className: 'custom-marker',
                            html: `<div class="w-4 h-4 rounded-full bg-${node.dangerLevel <= 3 ? 'green' : node.dangerLevel <= 7 ? 'amber' : 'red'}-500 border-2 border-white"></div>`,
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                          })
                        }
                      >
                        <Popup>
                          <div>
                            <h3 className="font-semibold">{node.name}</h3>
                            <p className="text-sm">
                              Safety: {node.isSafe ? 
                                <span className="text-green-600 font-medium">Safe Location</span> : 
                                <span className={`${node.dangerLevel <= 3 ? 'text-green-600' : node.dangerLevel <= 7 ? 'text-amber-600' : 'text-red-600'} font-medium`}>
                                  Risk Level: {node.dangerLevel}/10
                                </span>
                              }
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    
                    {/* Add safety zones as circles */}
                    {cityGraph && Array.from(cityGraph.nodes.values())
                      .filter(node => node.isSafe)
                      .map(node => (
                        <Circle
                          key={`circle-${node.id}`}
                          center={[node.lat || 30.3165, node.lng || 78.0322]}
                          radius={300}
                          pathOptions={{ 
                            color: '#059669',
                            fillColor: '#10B981',
                            fillOpacity: 0.2
                          }}
                        />
                      ))
                    }
                    
                    {/* Add danger zones as circles */}
                    {cityGraph && Array.from(cityGraph.nodes.values())
                      .filter(node => node.dangerLevel >= 8)
                      .map(node => (
                        <Circle
                          key={`danger-${node.id}`}
                          center={[node.lat || 30.3165, node.lng || 78.0322]}
                          radius={200}
                          pathOptions={{ 
                            color: '#DC2626',
                            fillColor: '#EF4444',
                            fillOpacity: 0.2
                          }}
                        />
                      ))
                    }
                  </MapContainer>
                </div>
                
                <div className="p-6 bg-gray-50">
                  <h3 className="font-semibold text-lg mb-3">Map Legend</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                      <span>Safe Location</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
                      <span>Moderate Risk</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                      <span>High Risk</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2">You</div>
                      <span>Your Location</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CheckSafety;