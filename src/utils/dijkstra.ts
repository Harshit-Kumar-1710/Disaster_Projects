import PriorityQueue from 'priority-queue-typescript';

// Define the graph structure
export interface Node {
  id: string;
  x: number;
  y: number;
  isSafe: boolean;
  dangerLevel: number; // 0 to 10, where 0 is completely safe
  name?: string;
  lat?: number;
  lng?: number;
}

export interface Edge {
  from: string;
  to: string;
  weight: number;
  dangerLevel: number; // 0 to 10, where 0 is completely safe
}

export interface Graph {
  nodes: Map<string, Node>;
  adjacencyList: Map<string, Array<{ nodeId: string; weight: number; dangerLevel: number }>>;
}

interface DijkstraResult {
  distances: Map<string, number>;
  previous: Map<string, string | null>;
  safetyScore: Map<string, number>;
}

// Create a new graph
export function createGraph(): Graph {
  return {
    nodes: new Map<string, Node>(),
    adjacencyList: new Map<string, Array<{ nodeId: string; weight: number; dangerLevel: number }>>(),
  };
}

// Add a node to the graph
export function addNode(graph: Graph, node: Node): void {
  graph.nodes.set(node.id, node);
  if (!graph.adjacencyList.has(node.id)) {
    graph.adjacencyList.set(node.id, []);
  }
}

// Add an edge to the graph
export function addEdge(graph: Graph, edge: Edge): void {
  // Make sure both nodes exist
  if (!graph.nodes.has(edge.from) || !graph.nodes.has(edge.to)) {
    throw new Error('Cannot add edge between non-existent nodes');
  }

  // Add the edge (from -> to)
  const adjacencyList = graph.adjacencyList.get(edge.from) || [];
  adjacencyList.push({
    nodeId: edge.to,
    weight: edge.weight,
    dangerLevel: edge.dangerLevel,
  });
  graph.adjacencyList.set(edge.from, adjacencyList);

  // Add the reverse edge (to -> from) for an undirected graph
  const reverseAdjacencyList = graph.adjacencyList.get(edge.to) || [];
  reverseAdjacencyList.push({
    nodeId: edge.from,
    weight: edge.weight,
    dangerLevel: edge.dangerLevel,
  });
  graph.adjacencyList.set(edge.to, reverseAdjacencyList);
}

// Find the shortest and safest path using Dijkstra's algorithm
export function findSafestPath(graph: Graph, startNodeId: string, endNodeId: string): {
  path: string[];
  distance: number;
  safetyScore: number;
} {
  // Check if start and end nodes exist
  if (!graph.nodes.has(startNodeId) || !graph.nodes.has(endNodeId)) {
    throw new Error('Start or end node does not exist in the graph');
  }

  const result = dijkstra(graph, startNodeId);
  const path = reconstructPath(result.previous, endNodeId);
  
  const distance = result.distances.get(endNodeId) || Infinity;
  const safetyScore = result.safetyScore.get(endNodeId) || Infinity;

  return {
    path,
    distance,
    safetyScore,
  };
}

// Dijkstra's algorithm implementation
function dijkstra(graph: Graph, startNodeId: string): DijkstraResult {
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const safetyScore = new Map<string, number>();
  
  // Initialize all distances as infinity and previous as null
  for (const nodeId of graph.nodes.keys()) {
    distances.set(nodeId, Infinity);
    previous.set(nodeId, null);
    safetyScore.set(nodeId, Infinity);
  }
  
  // Distance from start to start is 0
  distances.set(startNodeId, 0);
  safetyScore.set(startNodeId, graph.nodes.get(startNodeId)?.dangerLevel || 0);
  
  // Priority queue for nodes to visit (prioritized by distance + safety)
  const priorityQueue = new PriorityQueue<{ nodeId: string; priority: number }>(
    (a, b) => a.priority - b.priority
  );
  
  // Add start node to the queue
  priorityQueue.enqueue({ nodeId: startNodeId, priority: 0 });
  
  while (!priorityQueue.isEmpty()) {
    const { nodeId: currentNodeId } = priorityQueue.dequeue()!;
    const currentDistance = distances.get(currentNodeId) || Infinity;
    
    // Skip if we've found a better path already
    if (currentDistance === Infinity) continue;
    
    // Get all adjacent nodes
    const adjacentNodes = graph.adjacencyList.get(currentNodeId) || [];
    
    for (const { nodeId: neighborId, weight, dangerLevel } of adjacentNodes) {
      const newDistance = currentDistance + weight;
      const currentNeighborDistance = distances.get(neighborId) || Infinity;
      
      // Calculate safety score (combination of edge danger and node danger)
      const neighborNode = graph.nodes.get(neighborId);
      const currentNodeSafetyScore = safetyScore.get(currentNodeId) || 0;
      const edgeSafetyFactor = dangerLevel;
      const nodeSafetyFactor = neighborNode?.dangerLevel || 0;
      
      // Combine distance and safety factors
      // Lower safety score is better (less dangerous)
      const newSafetyScore = currentNodeSafetyScore + edgeSafetyFactor + nodeSafetyFactor;
      
      // Combined priority score (weight distance more than safety)
      const combinedScore = newDistance * 0.7 + newSafetyScore * 0.3;
      const currentCombinedScore = currentNeighborDistance * 0.7 + 
                                 (safetyScore.get(neighborId) || Infinity) * 0.3;
      
      // If we found a better path
      if (combinedScore < currentCombinedScore) {
        distances.set(neighborId, newDistance);
        previous.set(neighborId, currentNodeId);
        safetyScore.set(neighborId, newSafetyScore);
        
        // Enqueue the neighbor with the updated priority
        priorityQueue.enqueue({
          nodeId: neighborId,
          priority: combinedScore,
        });
      }
    }
  }
  
  return { distances, previous, safetyScore };
}

// Reconstruct the path from the previous nodes map
function reconstructPath(previous: Map<string, string | null>, endNodeId: string): string[] {
  const path: string[] = [];
  let currentNodeId: string | null = endNodeId;
  
  while (currentNodeId !== null) {
    path.unshift(currentNodeId);
    currentNodeId = previous.get(currentNodeId) || null;
  }
  
  return path;
}

// Generate a sample demo city graph for Dehradun
export function generateDemoCity(): Graph {
  const graph = createGraph();
  
  // Add nodes (locations in Dehradun)
  const nodes: Node[] = [
    { 
      id: 'clockTower', 
      lat: 30.3252, 
      lng: 78.0422, 
      x: 100, 
      y: 100, 
      isSafe: false, 
      dangerLevel: 6, 
      name: 'Clock Tower' 
    },
    { 
      id: 'doonHospital', 
      lat: 30.3219, 
      lng: 78.0322, 
      x: 150, 
      y: 250, 
      isSafe: true, 
      dangerLevel: 0, 
      name: 'Doon Hospital' 
    },
    { 
      id: 'railwayStation', 
      lat: 30.3185, 
      lng: 78.0327, 
      x: 200, 
      y: 150, 
      isSafe: true, 
      dangerLevel: 1, 
      name: 'Dehradun Railway Station' 
    },
    { 
      id: 'forestResearchInstitute', 
      lat: 30.3418, 
      lng: 77.9994, 
      x: 300, 
      y: 100, 
      isSafe: true, 
      dangerLevel: 0, 
      name: 'Forest Research Institute' 
    },
    { 
      id: 'pacificMall', 
      lat: 30.3164, 
      lng: 78.0321, 
      x: 250, 
      y: 200, 
      isSafe: false, 
      dangerLevel: 5, 
      name: 'Pacific Mall' 
    },
    { 
      id: 'rajpurRoad', 
      lat: 30.3279, 
      lng: 78.0451, 
      x: 350, 
      y: 250, 
      isSafe: false, 
      dangerLevel: 4, 
      name: 'Rajpur Road' 
    },
    { 
      id: 'paltan', 
      lat: 30.3248, 
      lng: 78.0436, 
      x: 100, 
      y: 300, 
      isSafe: false, 
      dangerLevel: 7, 
      name: 'Paltan Bazaar' 
    },
    { 
      id: 'itPark', 
      lat: 30.3385, 
      lng: 78.0068, 
      x: 400, 
      y: 350, 
      isSafe: true, 
      dangerLevel: 0, 
      name: 'IT Park' 
    },
    { 
      id: 'fireStation', 
      lat: 30.3234, 
      lng: 78.0359, 
      x: 300, 
      y: 350, 
      isSafe: true, 
      dangerLevel: 0, 
      name: 'Fire Station' 
    },
    { 
      id: 'policeHQ', 
      lat: 30.3247, 
      lng: 78.0389, 
      x: 200, 
      y: 50, 
      isSafe: true, 
      dangerLevel: 1, 
      name: 'Police Headquarters' 
    },
    { 
      id: 'isbt', 
      lat: 30.2877, 
      lng: 78.0318, 
      x: 50, 
      y: 200, 
      isSafe: true, 
      dangerLevel: 1, 
      name: 'ISBT Dehradun' 
    },
    { 
      id: 'ghantaGhar', 
      lat: 30.3252, 
      lng: 78.0422, 
      x: 250, 
      y: 300, 
      isSafe: false, 
      dangerLevel: 3, 
      name: 'Ghanta Ghar' 
    },
    { 
      id: 'doonUniversity', 
      lat: 30.3184, 
      lng: 78.0463, 
      x: 280, 
      y: 320, 
      isSafe: true, 
      dangerLevel: 0, 
      name: 'Doon University' 
    },
    { 
      id: 'maxHospital', 
      lat: 30.3382, 
      lng: 78.0685, 
      x: 320, 
      y: 180, 
      isSafe: true, 
      dangerLevel: 0, 
      name: 'Max Hospital' 
    },
    { 
      id: 'parade', 
      lat: 30.3241, 
      lng: 78.0398, 
      x: 180, 
      y: 280, 
      isSafe: true, 
      dangerLevel: 1, 
      name: 'Parade Ground' 
    }
  ];
  
  // Add all nodes to the graph
  nodes.forEach(node => addNode(graph, node));
  
  // Add edges (roads connecting locations)
  const edges: Edge[] = [
    { from: 'clockTower', to: 'paltan', weight: 150, dangerLevel: 5 },
    { from: 'clockTower', to: 'policeHQ', weight: 100, dangerLevel: 3 },
    { from: 'doonHospital', to: 'clockTower', weight: 160, dangerLevel: 4 },
    { from: 'doonHospital', to: 'paltan', weight: 120, dangerLevel: 5 },
    { from: 'railwayStation', to: 'pacificMall', weight: 130, dangerLevel: 3 },
    { from: 'railwayStation', to: 'isbt', weight: 200, dangerLevel: 2 },
    { from: 'forestResearchInstitute', to: 'itPark', weight: 180, dangerLevel: 1 },
    { from: 'pacificMall', to: 'rajpurRoad', weight: 140, dangerLevel: 4 },
    { from: 'rajpurRoad', to: 'maxHospital', weight: 160, dangerLevel: 3 },
    { from: 'paltan', to: 'ghantaGhar', weight: 170, dangerLevel: 4 },
    { from: 'itPark', to: 'fireStation', weight: 120, dangerLevel: 1 },
    { from: 'fireStation', to: 'doonUniversity', weight: 150, dangerLevel: 2 },
    { from: 'policeHQ', to: 'parade', weight: 140, dangerLevel: 2 },
    { from: 'isbt', to: 'railwayStation', weight: 160, dangerLevel: 3 },
    { from: 'ghantaGhar', to: 'parade', weight: 110, dangerLevel: 3 },
    { from: 'doonUniversity', to: 'maxHospital', weight: 180, dangerLevel: 2 },
    { from: 'maxHospital', to: 'policeHQ', weight: 200, dangerLevel: 3 },
    { from: 'parade', to: 'doonHospital', weight: 130, dangerLevel: 2 },
    { from: 'clockTower', to: 'ghantaGhar', weight: 100, dangerLevel: 4 },
    { from: 'pacificMall', to: 'doonUniversity', weight: 160, dangerLevel: 3 },
    { from: 'fireStation', to: 'parade', weight: 140, dangerLevel: 2 },
    { from: 'itPark', to: 'maxHospital', weight: 190, dangerLevel: 2 },
    { from: 'rajpurRoad', to: 'policeHQ', weight: 170, dangerLevel: 3 },
    { from: 'isbt', to: 'pacificMall', weight: 150, dangerLevel: 3 },
  ];
  
  // Add all edges to the graph
  edges.forEach(edge => addEdge(graph, edge));
  
  return graph;
}