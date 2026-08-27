import React, { useState, useEffect } from 'react';
import { Network } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { fetchGraphData } from '../api';

export const CareerGraph: React.FC = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchGraphData();

        // Assign coordinates dynamically for the SVG layout
        const jobNodes = data.nodes.filter((n: any) => n.type === 'job');
        const skillNodes = data.nodes.filter((n: any) => n.type === 'skill');
        const userNodes = data.nodes.filter((n: any) => n.type === 'user');

        userNodes.forEach((node: any) => {
          node.x = 50;
          node.y = 85;
          node.label = 'You (User)';
        });

        jobNodes.forEach((node: any, i: number) => {
          node.x =
            20 +
            (60 * (i / Math.max(1, jobNodes.length - 1)));
          node.y = 20;
        });

        skillNodes.forEach((node: any, i: number) => {
          // Wrap skills in a couple of rows
          const row = Math.floor(i / 5);
          const col = i % 5;

          node.x = 10 + (80 * (col / 4));
          node.y = 40 + (20 * row);
        });

        setNodes(data.nodes);
        setEdges(data.edges);

        if (data.nodes.length > 0) {
          setSelectedNode(data.nodes[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-neutral-dark">
        Loading graph...
      </div>
    );
  }

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-neutral-darkest">
          Explore Your Career Graph
        </h1>

        <p className="text-neutral mt-2 text-lg">
          See how your skills connect to technologies, projects, and career
          opportunities.
        </p>
      </div>

      <div className="flex-1 mt-6 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Graph Area */}
        <Card className="flex-1 overflow-hidden flex flex-col relative h-full bg-neutral-lightest">
          {/* Legend */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg border border-neutral-light shadow-sm text-sm z-10">
            <h4 className="font-semibold mb-2">Legend</h4>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary-dark"></div>
                Job Role
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                Skill
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                You
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full h-full overflow-auto">
            {/* Edges */}
            <svg
              className="absolute inset-0 w-[150%] h-[150%] md:w-full md:h-full pointer-events-none"
              style={{
                minWidth: '100%',
                minHeight: '100%',
              }}
            >
              {edges.map((edge, i) => {
                const sourceNode = nodes.find(
                  (n) => n.id === edge.source
                );

                const targetNode = nodes.find(
                  (n) => n.id === edge.target
                );

                if (!sourceNode || !targetNode) {
                  return null;
                }

                const isHighlighted =
                  selectedNode &&
                  (selectedNode.id === sourceNode.id ||
                    selectedNode.id === targetNode.id);

                return (
                  <line
                    key={i}
                    x1={`${sourceNode.x}%`}
                    y1={`${sourceNode.y}%`}
                    x2={`${targetNode.x}%`}
                    y2={`${targetNode.y}%`}
                    stroke={
                      isHighlighted
                        ? '#14b8a6'
                        : '#cbd5e1'
                    }
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected =
                selectedNode?.id === node.id;

              let bgClass =
                'bg-white border-neutral-light text-neutral-darkest';

              if (node.type === 'job') {
                bgClass =
                  'bg-primary-dark text-white border-primary-dark';
              } else if (node.type === 'skill') {
                bgClass =
                  'bg-success/10 border-success text-success-dark';
              } else if (node.type === 'user') {
                bgClass =
                  'bg-accent border-accent-dark text-white';
              }

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`
                    absolute
                    -translate-x-1/2
                    -translate-y-1/2
                    px-4
                    py-2
                    rounded-lg
                    border-2
                    shadow-sm
                    font-semibold
                    text-sm
                    transition-all
                    duration-300
                    hover:scale-105
                    ${bgClass}
                    ${isSelected
                      ? 'ring-4 ring-primary/30 scale-105 z-10'
                      : ''
                    }
                  `}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                  }}
                >
                  {node.label}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Detail Panel */}
        <Card className="w-full md:w-80 h-full overflow-y-auto shrink-0 border-l-4 border-l-primary/50">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <Network
                size={20}
                className="text-primary"
              />

              <span className="text-sm font-medium text-neutral-dark uppercase tracking-wider">
                {selectedNode.type === 'job'
                  ? 'Job Role'
                  : selectedNode.type === 'user'
                    ? 'Profile'
                    : 'Skill'}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-neutral-darkest mb-4">
              {selectedNode.label}
            </h2>

            {/* Job Details */}
            {selectedNode.type === 'job' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-neutral-darkest mb-2">
                    Required Skills
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {edges
                      .filter(
                        (e) =>
                          e.source === selectedNode.id
                      )
                      .map((e) => {
                        const target = nodes.find(
                          (n) => n.id === e.target
                        );

                        return target ? (
                          <Badge
                            key={target.id}
                            variant="outline"
                          >
                            {target.label}
                          </Badge>
                        ) : null;
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Skill Details */}
            {selectedNode.type === 'skill' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-neutral-darkest mb-2">
                    Required by roles:
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {edges
                      .filter(
                        (e) =>
                          e.target === selectedNode.id &&
                          nodes.find(
                            (n) => n.id === e.source
                          )?.type === 'job'
                      )
                      .map((e) => {
                        const source = nodes.find(
                          (n) => n.id === e.source
                        );

                        return source ? (
                          <Badge
                            key={source.id}
                            variant="default"
                          >
                            {source.label}
                          </Badge>
                        ) : null;
                      })}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-darkest mb-2">
                    Related connections:
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {edges
                      .filter((e) => {
                        const otherId =
                          e.source === selectedNode.id
                            ? e.target
                            : e.source;

                        const otherNode = nodes.find(
                          (n) => n.id === otherId
                        );

                        return (
                          (e.target === selectedNode.id ||
                            e.source === selectedNode.id) &&
                          otherNode?.type === 'skill'
                        );
                      })
                      .map((e) => {
                        const otherId =
                          e.source === selectedNode.id
                            ? e.target
                            : e.source;

                        const otherNode = nodes.find(
                          (n) => n.id === otherId
                        );

                        return otherNode ? (
                          <Badge
                            key={otherNode.id}
                            variant="outline"
                          >
                            {otherNode.label}
                          </Badge>
                        ) : null;
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* User Details */}
            {selectedNode.type === 'user' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-neutral-darkest mb-2">
                    Your Current Skills
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {edges
                      .filter(
                        (e) =>
                          e.source === selectedNode.id
                      )
                      .map((e) => {
                        const target = nodes.find(
                          (n) => n.id === e.target
                        );

                        return target ? (
                          <Badge
                            key={target.id}
                            variant="success"
                          >
                            {target.label}
                          </Badge>
                        ) : null;
                      })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
