import { useState } from 'react';
import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import INode from '../../../types/INode';
import EditNodeCommand from '../../../Command/EditNodeCommand';
import DeleteNodeCommand from '../../../Command/DeleteNodeCommand';

export default function NodeListModule() {
    const graph = useGraph();
    const history = useHistory();

    const [workingNode, setWorkingNode] = useState<INode | null>(null);
    const [editNodeName, setEditNodeName] = useState<string>('');

    return (
        <>
            <h3>Nodes</h3>
            <ul>
                {graph.nodes.map((node) => (
                    <li key={node.id}>
                        {workingNode?.id === node.id ? (
                            <>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (!workingNode) return;
                                        if (!editNodeName) return;

                                        const command = new EditNodeCommand(
                                            {
                                                ...workingNode,
                                                name: editNodeName,
                                            },
                                            graph
                                        );

                                        command.execute();
                                        history.push(command);

                                        setWorkingNode(null);
                                        setEditNodeName('');
                                    }}>
                                    <input
                                        type="text"
                                        value={editNodeName}
                                        onChange={(event) =>
                                            setEditNodeName(event.target.value)
                                        }
                                    />
                                    <button type="submit">Save</button>
                                </form>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setWorkingNode(node);
                                        setEditNodeName(node.name);
                                    }}>
                                    {node.id} {node.name}
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => {
                                const command = new DeleteNodeCommand(
                                    node,
                                    graph
                                );

                                command.execute();
                                history.push(command);
                            }}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
}
