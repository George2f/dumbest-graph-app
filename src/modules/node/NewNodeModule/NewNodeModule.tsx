import { useCallback, useState } from 'react';
import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import AddNodeCommand from '../../../Command/AddNodeCommand';
import Button from '../../../components/Button';

export default function NewNodeModule() {
    const graph = useGraph();
    const history = useHistory();

    const [newNodeName, setNewNodeName] = useState<string>('');
    const [newAttributes, setNewAttributes] = useState<[string, string][]>([
        ['', ''],
    ]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (!newNodeName) return;
            const command = new AddNodeCommand(
                {
                    id: graph.getNewId(),
                    name: newNodeName,
                    tags: [],
                    attributes: newAttributes.filter(
                        ([key, value]) => key && value
                    ),
                },
                graph
            );
            command.execute();
            history.push(command);

            setNewNodeName('');
            setNewAttributes([['', '']]);
        },
        [graph, history, newAttributes, newNodeName]
    );

    return (
        <>
            <h3>New Node</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        autoFocus
                        value={newNodeName}
                        onChange={(event) => setNewNodeName(event.target.value)}
                    />
                </label>
                <h4>Attributes</h4>
                {newAttributes.map(([key, value], index) => (
                    <div key={index}>
                        <label>
                            Key:
                            <input
                                type="text"
                                value={key}
                                onChange={(event) => {
                                    const isLast =
                                        index === newAttributes.length - 1;

                                    const newAttributesCopy = [
                                        ...newAttributes,
                                    ];
                                    newAttributesCopy[index][0] =
                                        event.target.value;
                                    if (isLast) {
                                        newAttributesCopy.push(['', '']);
                                    }
                                    setNewAttributes(newAttributesCopy);
                                }}
                            />
                        </label>
                        <label>
                            Value:
                            <input
                                type="text"
                                value={value}
                                onChange={(event) => {
                                    const newAttributesCopy = [
                                        ...newAttributes,
                                    ];
                                    newAttributesCopy[index][1] =
                                        event.target.value;
                                    setNewAttributes(newAttributesCopy);
                                }}
                            />
                        </label>
                        {index === newAttributes.length - 1 ? null : (
                            <Button
                                type="reset"
                                tabIndex={-1}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const futureNewAttributes =
                                        newAttributes.slice();
                                    futureNewAttributes.splice(index, 1);
                                    setNewAttributes(futureNewAttributes);
                                }}>
                                Delete
                            </Button>
                        )}
                    </div>
                ))}
                <div>
                    <Button type="submit">Add Node</Button>
                </div>
            </form>
        </>
    );
}
