import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import DeleteNodeCommand from '../../../Command/DeleteNodeCommand';
import NodeListItem from './components/NodeListItem';
import { useMemo } from 'react';

export default function NodeListModule() {
    const graph = useGraph();
    const history = useHistory();

    const displayedNodes = useMemo(() => {
        return graph.nodes.filter(() => true);
    }, [graph]);

    return (
        <ul className="grid grid-cols-1 gap-2 overflow-y-auto md:grid-cols-2 lg:grid-cols-3">
            {displayedNodes.map((node) => (
                <li key={node.id}>
                    <NodeListItem
                        node={node}
                        graph={graph}
                        onDelete={(deletedNode) => {
                            const command = new DeleteNodeCommand(
                                deletedNode,
                                graph
                            );

                            command.execute();
                            history.push(command);
                        }}
                    />
                </li>
            ))}
        </ul>
    );
}
