import { Link } from 'react-router-dom';
import { Compass, AlertTriangle, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-20 pb-12 bg-gray-50">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="page-title">Welcome, {currentUser?.name || 'User'}!</h1>
              <p className="page-subtitle">
                Use Safescape's tools to stay safe during emergencies.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/add-location" className="dashboard-card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <Compass className="h-12 w-12 text-blue-800 mb-4" />
                <h2 className="text-xl font-semibold text-blue-900 mb-2">Add Location</h2>
                <p className="text-center text-blue-700">
                  Add and manage your frequently visited locations for emergency planning.
                </p>
              </Link>
              
              <Link to="/sos" className="dashboard-card bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                <AlertTriangle className="h-12 w-12 text-red-600 mb-4 animate-pulse" />
                <h2 className="text-xl font-semibold text-red-900 mb-2">SOS</h2>
                <p className="text-center text-red-700">
                  Activate emergency mode to find the fastest and safest evacuation route.
                </p>
              </Link>
              
              <Link to="/check-safety" className="dashboard-card bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                <CheckCircle className="h-12 w-12 text-emerald-600 mb-4" />
                <h2 className="text-xl font-semibold text-emerald-900 mb-2">Check Safety</h2>
                <p className="text-center text-emerald-700">
                  Verify if your current location is safe based on real-time data.
                </p>
              </Link>
            </div>
            
            <div className="mt-12 p-6 bg-white rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4">Safety Tips</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-3 flex-shrink-0">1</span>
                  <span>Create an emergency kit with essentials like water, food, medications, and first aid supplies.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-3 flex-shrink-0">2</span>
                  <span>Keep important documents in a waterproof container and have digital copies.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-3 flex-shrink-0">3</span>
                  <span>Establish a communication plan with family members for emergencies.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-3 flex-shrink-0">4</span>
                  <span>Know multiple evacuation routes from your home and workplace.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-3 flex-shrink-0">5</span>
                  <span>Keep emergency contacts easily accessible both digitally and physically.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;