import { useCallback, useState } from 'react';
import ReactFlow, { ReactFlowProvider, useReactFlow, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import './styles/button.css';
import { Grid, Button } from '@material-ui/core';

import defaultNodes from './nodes.js';
import defaultEdges from './edges.js';


const edgeOptions = {
  animated: false,
  style: {
    stroke: '#FFFFF',
  },
};

const connectionLineStyle = { stroke: '#FFFFF' };

let nodeId = 3;

function Flow() {
  const reactFlowInstance = useReactFlow();
  const [node, setNode] = useState(1);
  let [nodes, setNodes] = useState(defaultNodes);
  let [edges, setEdges] = useState(defaultEdges);
  const [pageRankDisplay, setPageRankDisplay] = useState(false);
  const [neighborDisplay, setNeighborDisplay] = useState(false);
  const [neighbours, setNeighbours] = useState([]);
  const [neighbourString, setNeighbourString] = useState('');
  const [pageRankValue, setPageRankValue] = useState(0);
  const onClick = useCallback(() => {
    const id = `${++nodeId}`;
    const newNode = {
      id,
      position: {
        x: Math.random() * 100,
        y: Math.random() * 200,
      },
      data: {
        label: `${id}`,
      },
    };
    reactFlowInstance.addNodes(newNode);
    setNodes(reactFlowInstance.getNodes());
    console.log(reactFlowInstance.getNodes());
    
  }, [reactFlowInstance]);

  const getNeighbours = (node) => {
    const neighbours = [];
    const edges = reactFlowInstance.getEdges();
    edges.forEach((edge) => {
      
      if (edge.source === node) {
        neighbours.push(edge.target);
      }
      if (edge.target === node) {
        neighbours.push(edge.source);
      }
    });
    console.log(neighbours);
    // make string of neighbours and do not put comma after last element
    let neighbourString = '';
    if (neighbours.length > 0) {
    neighbours.forEach((neighbour, index) => {
      if (index === neighbours.length - 1) {
        neighbourString += neighbour;
      } else {
        neighbourString += neighbour + ', ';
      }
    });
  }
  else {
    neighbourString = 'None';
  }
    
    setNeighbourString(neighbourString);
    setNeighbours(neighbours);
    setNeighborDisplay(true);
    setPageRankDisplay(false);
    return neighbours;
  };


  const getPageRank = (node) => {
    const neighbours = getNeighbours(node);
    let rank = 0;
    // rank = 1/ neighbours.length;
    neighbours.forEach((neighbour) => {
      console.log(getNeighbours(neighbour).length);
      rank += 1 / getNeighbours(neighbour).length;
    });
    console.log("pagerank", rank);
    setPageRankValue(rank);
    setPageRankDisplay(true);
    setNeighborDisplay(false);
    return rank;
  };

  const deleteNode = (node) => {
    // const edges = reactFlowInstance.getEdges();
    let nodes = []
    edges.forEach((edge) => {
      if (edge.source === node || edge.target === node) {
        // remove edges from the graph
        nodes.push(edge.source);
        setNodes(nodes);
      }
    });
  
  };




  return (
    
    <div style={{ height: 800, width: 800 }}>
      <Grid item xs={12} className="controls">
        <button onClick={() => onClick()}>Add a Node</button>
        <button onClick={() => getNeighbours(node)}>Get Neighbors of Node {node}</button>
        <button onClick={() => getPageRank(node)}>Get PageRank of Node {node}</button>
        {/* <button onClick={() => deleteNode(node)}>Delete Node {node}</button> */}
        
        
        <select value={node} onChange={(event) => setNode(event.target.value)}>
        {nodes.map((d) => (
              <option value={d['id']} key={d['id']}>
                {d['id']}
              </option>
            ))}
        </select>
        {(neighborDisplay) && (
        <label>Neighbors : {neighbourString}</label>
        )}
        {(pageRankDisplay) && (
        <label>PageRank : {pageRankValue}</label>
        )}
      </Grid>
      <ReactFlow
        defaultNodes={defaultNodes}
        defaultEdges={defaultEdges}
        defaultEdgeOptions={edgeOptions}
        fitView
        connectionLineStyle={connectionLineStyle}
      />
      
      {/* <Background /> */}

    </div>
  );
      }

  export default function App() {
    return (
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    );
  }


