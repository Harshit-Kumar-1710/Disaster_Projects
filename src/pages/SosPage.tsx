import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ArrowRight, Navigation } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { generateDemoCity, Graph, Node, findSafestPath } from '../utils/dijkstra';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

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

interface MapSetViewProps {
  coordinates: [number, number];
}

const MapSetView: React.FC<MapSetViewProps> = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coordinates, 14);
  }, [coordinates, map]);
  
  return null;
};

const SosPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [sosActivated, setSosActivated] = useState(false);
  const [cityGraph, setCityGraph] = useState<Graph | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Node | null>(null);
  const [evacuationRoute, setEvacuationRoute] = useState<{
    path: string[];
    distance: number;
    safetyScore: number;
  } | null>(null);
  const [safeLocations, setSafeLocations] = useState<Node[]>([]);
  const [selectedSafeLocation, setSelectedSafeLocation] = useState<Node | null>(null);
  
  useEffect(() => {
    const demoCity = generateDemoCity();
    setCityGraph(demoCity);
    
    const storedLocation = localStorage.getItem('safescape_selected_location');
    let userLocation: Node;
    
    if (storedLocation) {
      userLocation = JSON.parse(storedLocation);
    } else {
      userLocation = Array.from(demoCity.nodes.values()).find(node => node.id === 'residential1') || 
                    Array.from(demoCity.nodes.values())[0];
    }
    
    setCurrentLocation(userLocation);
    
    const safeNodes = Array.from(demoCity.nodes.values()).filter(node => node.isSafe);
    setSafeLocations(safeNodes);
    
    if (safeNodes.length > 0) {
      setSelectedSafeLocation(safeNodes[0]);
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  
  const activateSOS = async () => {
    if (!cityGraph || !currentLocation || !selectedSafeLocation) return;
    
    setCalculating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const route = findSafestPath(cityGraph, currentLocation.id, selectedSafeLocation.id);
      setEvacuationRoute(route);
      setSosActivated(true);
    } catch (err) {
      console.error('Error finding evacuation route:', err);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-20 pb-12 bg-gray-50">
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
                  selectedSafeLocation?.id === node.id ?
                  L.divIcon({
                    className: 'custom-marker',
                    html: `<div class="w-6 h-6 rounded-full bg-green-500 border-2 border-white pulse-animation"></div>`,
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
                    {node.isSafe && node.id !== selectedSafeLocation?.id && (
                      <button 
                        onClick={() => setSelectedSafeLocation(node)}
                        className="mt-2 px-3 py-1 bg-blue-800 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Set as Destination
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {evacuationRoute && evacuationRoute.path.map((nodeId, index) => {
              if (index === evacuationRoute.path.length - 1) return null;
              
              const currentNode = cityGraph?.nodes.get(nodeId);
              const nextNode = cityGraph?.nodes.get(evacuationRoute.path[index + 1]);
              
              if (!currentNode || !nextNode) return null;
              
              return (
                <Polyline 
                  key={`path-${index}`}
                  positions={[
                    [currentNode.lat || 30.3165, currentNode.lng || 78.0322],
                    [nextNode.lat || 30.3165, nextNode.lng || 78.0322]
                  ]}
                  color="#DC2626"
                  weight={4}
                  opacity={0.8}
                  dashArray="10, 10"
                  className="animate-pulse"
                />
              );
            })}
          </MapContainer>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SosPage;