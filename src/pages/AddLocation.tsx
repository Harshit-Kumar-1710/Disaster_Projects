import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, ArrowLeft, Check } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Custom Marker Colors for safety level
const getSafetyMarker = (dangerLevel: number) => {
  const color = dangerLevel <= 3 ? 'green' : 
               dangerLevel <= 7 ? 'orange' : 'red';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="w-4 h-4 rounded-full bg-${color}-500 border-2 border-white"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

interface DemoCityProps {
  onCityGenerated: (graph: Graph) => void;
}

// Component to set the map view on load
const MapSetView: React.FC<{ coordinates: [number, number] }> = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coordinates, 13);
  }, [coordinates, map]);
  
  return null;
};

const DemoCity: React.FC<DemoCityProps> = ({ onCityGenerated }) => {
  useEffect(() => {
    // Generate the demo city graph
    const demoCity = generateDemoCity();
    onCityGenerated(demoCity);
  }, [onCityGenerated]);
  
  return null;
};

const AddLocation: React.FC = () => {
  const navigate = useNavigate();
  const [cityGraph, setCityGraph] = useState<Graph | null>(null);
  const [locationAdded, setLocationAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Node | null>(null);
  
  // Convert graph to GeoJSON for map display
  const handleCityGenerated = (graph: Graph) => {
    setCityGraph(graph);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  
  // Handle location selection
  const handleLocationSelect = (node: Node) => {
    setSelectedLocation(node);
  };
  
  // Add the selected location
  const addLocation = () => {
    if (selectedLocation) {
      // In a real app, we would save this to the user's profile
      localStorage.setItem('safescape_selected_location', JSON.stringify(selectedLocation));
      setLocationAdded(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
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
              <h1 className="page-title">Add Location</h1>
              <p className="page-subtitle">
                Add a location to your profile for emergency planning.
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-800 mb-4"></div>
              <p className="text-xl text-gray-600">Generating demo city...</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Demo City Map</h2>
                <p className="text-gray-600">
                  This is a demo city with various locations. Select a location to add to your profile.
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
                  
                  <DemoCity onCityGenerated={handleCityGenerated} />
                  
                  {cityGraph && Array.from(cityGraph.nodes.values()).map((node) => (
                    <Marker 
                      key={node.id}
                      position={[node.lat || 30.3165, node.lng || 78.0322]}
                      icon={node.isSafe ? 
                        L.divIcon({
                          className: 'custom-marker',
                          html: `<div class="w-4 h-4 rounded-full bg-green-500 border-2 border-white pulse-animation"></div>`,
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
                      eventHandlers={{
                        click: () => handleLocationSelect(node),
                      }}
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
                          <button 
                            onClick={() => handleLocationSelect(node)}
                            className="mt-2 px-3 py-1 bg-blue-800 text-white text-xs rounded hover:bg-blue-700"
                          >
                            Select
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              
              <div className="p-6 bg-gray-50">
                {selectedLocation ? (
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedLocation.name}</h3>
                      <p className="text-gray-600">
                        Safety Status: {selectedLocation.isSafe ? 
                          <span className="text-green-600 font-medium">Safe Location</span> : 
                          <span className={`${selectedLocation.dangerLevel <= 3 ? 'text-green-600' : selectedLocation.dangerLevel <= 7 ? 'text-amber-600' : 'text-red-600'} font-medium`}>
                            Risk Level: {selectedLocation.dangerLevel}/10
                          </span>
                        }
                      </p>
                    </div>
                    
                    <button
                      onClick={addLocation}
                      disabled={locationAdded}
                      className={`btn ${locationAdded ? 'bg-green-600 hover:bg-green-600' : 'bg-blue-800 hover:bg-blue-700'} text-white flex items-center`}
                    >
                      {locationAdded ? (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          Location Added
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5 mr-2" />
                          Add Location
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="text-gray-500">Select a location from the map to add it to your profile.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AddLocation;