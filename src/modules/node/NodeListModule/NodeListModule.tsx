import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import EditNodeCommand from '../../../Command/EditNodeCommand';
import DeleteNodeCommand from '../../../Command/DeleteNodeCommand';
import NodeListItem from './components/NodeListItem';
import NewNodeModule from '../NewNodeModule';

export default function NodeListModule() {
    const graph = useGraph();
    const history = useHistory();

    return (
        <div className="flex h-full flex-col overflow-hidden">
            <h2 className="text-3xl">Nodes</h2>
            <ul className="overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {graph.nodes.map((node) => (
                    <li key={node.id}>
                        <NodeListItem
                            node={node}
                            graph={graph}
                            onChange={(changedNode) => {
                                const command = new EditNodeCommand(
                                    changedNode,
                                    graph
                                );

                                command.execute();
                                history.push(command);
                            }}
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
            <NewNodeModule />
        </div>
    );
}
