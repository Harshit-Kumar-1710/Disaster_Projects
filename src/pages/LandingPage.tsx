import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Map, Navigation, AlertCircle, Activity, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div 
            className="h-full w-full bg-cover bg-center bg-no-repeat" 
            style={{ 
              backgroundImage: 'url(https://images.pexels.com/photos/753619/pexels-photo-753619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backgroundBlendMode: 'overlay'
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse-slow inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 mb-6">
              <Shield className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Intelligent Evacuation System</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Find the Safest Path in Times of Disaster
            </h1>
            
            <p className="text-xl text-gray-200 mb-8">
              Safescape uses advanced algorithms to provide the safest and shortest evacuation routes during emergencies, prioritizing your safety when it matters most.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup" className="btn-primary w-full sm:w-auto">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary w-full sm:w-auto">
                Sign In
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <a 
            href="#features" 
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition"
          >
            <ArrowRight className="h-5 w-5 transform rotate-90" />
          </a>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Safescape Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our smart disaster evacuation system helps you navigate to safety with cutting-edge technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-blue-100 text-blue-800 mb-4">
                <Map className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Mapping</h3>
              <p className="text-gray-600">
                Our system creates real-time maps of your surroundings, identifying potential hazards and safe zones.
              </p>
            </div>
            
            <div className="card flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-red-100 text-red-800 mb-4">
                <Navigation className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Optimal Route Finding</h3>
              <p className="text-gray-600">
                Using Dijkstra's algorithm, we calculate the safest and shortest path to evacuate during emergencies.
              </p>
            </div>
            
            <div className="card flex flex-col items-center text-center">
              <div className="p-4 rounded-full bg-emerald-100 text-emerald-800 mb-4">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safety Verification</h3>
              <p className="text-gray-600">
                Constantly monitor your location's safety status and receive alerts when conditions change.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Safescape Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From setup to evacuation, we guide you every step of the way.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-800 text-white">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Set Up Your Profile</h3>
                    <p className="mt-2 text-gray-600">
                      Create an account and set up your profile with relevant personal information.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-800 text-white">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Add Your Location</h3>
                    <p className="mt-2 text-gray-600">
                      Input your common locations like home, work, or school for instant evacuation planning.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-800 text-white">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Emergency Activation</h3>
                    <p className="mt-2 text-gray-600">
                      In case of emergency, activate SOS to get immediate evacuation routes to safety.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-800 text-white">
                      4
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Follow Guided Evacuation</h3>
                    <p className="mt-2 text-gray-600">
                      Follow the calculated route to safety, with real-time updates as conditions change.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-96 overflow-hidden rounded-xl shadow-xl">
              <img 
                src="https://images.pexels.com/photos/7813994/pexels-photo-7813994.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Evacuation Map" 
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-60"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-5 w-5 text-red-400 animate-pulse" />
                  <span className="text-sm font-medium">Live Evacuation Route</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Shortest Safe Path</h3>
                <p className="text-sm">Calculated using advanced Dijkstra's algorithm</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Ensure Your Safety?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join Safescape today and be prepared for emergencies with our intelligent evacuation system.
            </p>
            <Link to="/signup" className="btn bg-white text-blue-800 hover:bg-gray-100 focus:ring-white">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LandingPage;