// Constants
const DEHRADUN_CENTER = [30.3165, 78.0322];

// State management
let currentUser = null;
let map = null;
let cityGraph = null;
let currentLocation = null;
let selectedSafeLocation = null;
let evacuationRoute = null;

// DOM Elements
const sections = {
    landing: document.getElementById('landing'),
    authForms: document.getElementById('authForms'),
    dashboard: document.getElementById('dashboard'),
    mapSection: document.getElementById('mapSection')
};

const forms = {
    login: document.getElementById('loginForm'),
    signup: document.getElementById('signupForm')
};

// Initialize map
function initializeMap() {
    map = L.map('map').setView(DEHRADUN_CENTER, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Graph data structure and algorithms
class Graph {
    constructor() {
        this.nodes = new Map();
        this.adjacencyList = new Map();
    }

    addNode(id, data) {
        this.nodes.set(id, { id, ...data });
        this.adjacencyList.set(id, []);
    }

    addEdge(from, to, weight, dangerLevel) {
        this.adjacencyList.get(from).push({ node: to, weight, dangerLevel });
        this.adjacencyList.get(to).push({ node: from, weight, dangerLevel });
    }
}

function generateDemoCity() {
    const graph = new Graph();

    // Add nodes (locations in Dehradun)
    const locations = [
        { id: 'clockTower', name: 'Clock Tower', lat: 30.3252, lng: 78.0422, isSafe: false, dangerLevel: 6 },
        { id: 'doonHospital', name: 'Doon Hospital', lat: 30.3219, lng: 78.0322, isSafe: true, dangerLevel: 0 },
        { id: 'railwayStation', name: 'Railway Station', lat: 30.3185, lng: 78.0327, isSafe: true, dangerLevel: 1 },
        { id: 'forestInstitute', name: 'Forest Research Institute', lat: 30.3418, lng: 77.9994, isSafe: true, dangerLevel: 0 },
        { id: 'pacificMall', name: 'Pacific Mall', lat: 30.3164, lng: 78.0321, isSafe: false, dangerLevel: 5 },
        { id: 'fireStation', name: 'Fire Station', lat: 30.3234, lng: 78.0359, isSafe: true, dangerLevel: 0 }
    ];

    locations.forEach(loc => graph.addNode(loc.id, loc));

    // Add edges (connections between locations)
    const edges = [
        ['clockTower', 'doonHospital', 1000, 4],
        ['doonHospital', 'pacificMall', 800, 3],
        ['pacificMall', 'railwayStation', 600, 2],
        ['railwayStation', 'fireStation', 1200, 1],
        ['fireStation', 'forestInstitute', 2000, 2],
        ['forestInstitute', 'clockTower', 2500, 3]
    ];

    edges.forEach(([from, to, weight, dangerLevel]) => {
        graph.addEdge(from, to, weight, dangerLevel);
    });

    return graph;
}

// Dijkstra's algorithm for finding safest path
function findSafestPath(graph, start, end) {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();
    
    graph.nodes.forEach((node, id) => {
        distances.set(id, Infinity);
        previous.set(id, null);
        unvisited.add(id);
    });
    
    distances.set(start, 0);
    
    while (unvisited.size > 0) {
        let current = null;
        let shortestDistance = Infinity;
        
        unvisited.forEach(nodeId => {
            if (distances.get(nodeId) < shortestDistance) {
                shortestDistance = distances.get(nodeId);
                current = nodeId;
            }
        });
        
        if (current === end) break;
        
        unvisited.delete(current);
        
        const neighbors = graph.adjacencyList.get(current);
        neighbors.forEach(({ node: neighbor, weight, dangerLevel }) => {
            if (!unvisited.has(neighbor)) return;
            
            const distance = distances.get(current) + weight;
            const safety = dangerLevel;
            const totalCost = distance * (1 + safety * 0.1);
            
            if (totalCost < distances.get(neighbor)) {
                distances.set(neighbor, totalCost);
                previous.set(neighbor, current);
            }
        });
    }
    
    const path = [];
    let current = end;
    
    while (current !== null) {
        path.unshift(current);
        current = previous.get(current);
    }
    
    return {
        path,
        distance: distances.get(end)
    };
}

// UI Event Handlers
document.getElementById('getStartedBtn').addEventListener('click', () => {
    sections.landing.classList.add('hidden');
    sections.authForms.classList.remove('hidden');
    forms.signup.classList.remove('hidden');
});

document.getElementById('loginBtn').addEventListener('click', (e) => {
    e.preventDefault();
    sections.landing.classList.add('hidden');
    sections.authForms.classList.remove('hidden');
    forms.signup.classList.add('hidden');
    forms.login.classList.remove('hidden');
});

document.getElementById('signupBtn').addEventListener('click', (e) => {
    e.preventDefault();
    sections.landing.classList.add('hidden');
    sections.authForms.classList.remove('hidden');
    forms.login.classList.add('hidden');
    forms.signup.classList.remove('hidden');
});

// Form submissions
forms.login.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    currentUser = { name: email.split('@')[0], email };
    localStorage.setItem('safescape_user', JSON.stringify(currentUser));
    showDashboard();
});

forms.signup.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    currentUser = { name, email };
    localStorage.setItem('safescape_user', JSON.stringify(currentUser));
    showDashboard();
});

// Dashboard functionality
function showDashboard() {
    sections.authForms.classList.add('hidden');
    sections.dashboard.classList.remove('hidden');
    document.getElementById('userName').textContent = currentUser.name;
}

// Initialize map functionality
document.getElementById('addLocationCard').addEventListener('click', () => {
    sections.dashboard.classList.add('hidden');
    sections.mapSection.classList.remove('hidden');
    if (!map) {
        initializeMap();
    }
    document.getElementById('confirmLocationBtn').classList.remove('hidden');
    cityGraph = generateDemoCity();
    showLocationsOnMap();
});

document.getElementById('sosCard').addEventListener('click', () => {
    sections.dashboard.classList.add('hidden');
    sections.mapSection.classList.remove('hidden');
    if (!map) {
        initializeMap();
    }
    document.getElementById('findRouteBtn').classList.remove('hidden');
    cityGraph = generateDemoCity();
    showLocationsOnMap();
    calculateAndShowRoute();
});

document.getElementById('checkSafetyCard').addEventListener('click', () => {
    sections.dashboard.classList.add('hidden');
    sections.mapSection.classList.remove('hidden');
    if (!map) {
        initializeMap();
    }
    document.getElementById('checkSafetyBtn').classList.remove('hidden');
    cityGraph = generateDemoCity();
    showLocationsOnMap();
    checkLocationSafety();
});

// Map functionality
function showLocationsOnMap() {
    if (!cityGraph) return;
    
    cityGraph.nodes.forEach((location) => {
        const color = location.isSafe ? '#059669' : 
                     location.dangerLevel <= 3 ? '#059669' :
                     location.dangerLevel <= 7 ? '#d97706' : '#dc2626';
        
        const marker = L.circleMarker([location.lat, location.lng], {
            radius: 8,
            fillColor: color,
            color: 'white',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        marker.bindPopup(`
            <strong>${location.name}</strong><br>
            ${location.isSafe ? 'Safe Location' : `Risk Level: ${location.dangerLevel}/10`}
        `);
    });
}

function calculateAndShowRoute() {
    if (!currentLocation || !selectedSafeLocation) return;
    
    const route = findSafestPath(cityGraph, currentLocation.id, selectedSafeLocation.id);
    
    if (route.path.length < 2) return;
    
    const routeCoordinates = route.path.map(nodeId => {
        const node = cityGraph.nodes.get(nodeId);
        return [node.lat, node.lng];
    });
    
    L.polyline(routeCoordinates, {
        color: '#dc2626',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10'
    }).addTo(map);
}

function checkLocationSafety() {
    if (!currentLocation) return;
    
    const location = cityGraph.nodes.get(currentLocation.id);
    const isSafe = location.isSafe;
    const dangerLevel = location.dangerLevel;
    
    let message = '';
    let color = '';
    
    if (isSafe) {
        message = 'You are in a safe location';
        color = '#059669';
    } else if (dangerLevel <= 3) {
        message = 'Your location is relatively safe';
        color = '#059669';
    } else if (dangerLevel <= 7) {
        message = 'Your location has moderate risk';
        color = '#d97706';
    } else {
        message = 'Your location is high risk!';
        color = '#dc2626';
    }
    
    L.popup()
        .setLatLng([location.lat, location.lng])
        .setContent(`
            <div style="color: ${color}; font-weight: bold;">
                ${message}
            </div>
        `)
        .openOn(map);
}

// Back button functionality
document.getElementById('backBtn').addEventListener('click', () => {
    sections.mapSection.classList.add('hidden');
    sections.dashboard.classList.remove('hidden');
    document.getElementById('confirmLocationBtn').classList.add('hidden');
    document.getElementById('findRouteBtn').classList.add('hidden');
    document.getElementById('checkSafetyBtn').classList.add('hidden');
});

// Check for existing user session
window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('safescape_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
});