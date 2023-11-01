import { useMemo } from 'react';
import { useGraph } from '../providers/GraphProvider';
import { ForceGraph2D } from 'react-force-graph';

export default function Graph() {
    const { nodes, links } = useGraph();

    const displayGraph = useMemo(() => {
        return {
            nodes: nodes.map((node) => {
                return {
                    id: node.id,
                    label: node.name,
                };
            }),
            links: links.map((link) => {
                return {
                    id: link.id,
                    source: link.node1Id,
                    target: link.node2Id,
                    label: link.name,
                };
            }),
        };
    }, []);

    return (
        <div style={{ height: 'calc(100vh - 16px)' }}>
            <h1>Graph</h1>
            <ForceGraph2D />
        </div>
    );
}
