import { useCallback, useState } from 'react';
import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import AddNodeCommand from '../../../Command/AddNodeCommand';
import Button from '../../../components/Button';
import IdType from '../../../types/IdType';
import TagPill from '../../../components/TagPill';
import INode from '../../../types/INode';
import IAttribute from '../../../types/IAttribute';

interface NewNodeModuleProps {
    original?: INode;
}

export default function NewNodeModule({ original }: NewNodeModuleProps) {
    const graph = useGraph();
    const history = useHistory();

    const [newNodeName, setNewNodeName] = useState<string>('');
    const [newAttributes, setNewAttributes] = useState<IAttribute[]>(
        original?.attributes || []
    );
    const [newNodeTags, setNewNodeTags] = useState<IdType[]>(
        original?.tags || []
    );

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (!newNodeName) return;
            const command = new AddNodeCommand(
                {
                    id: graph.getNewId(),
                    name: newNodeName,
                    tags: newNodeTags,
                    attributes: newAttributes.filter((a) => a.key && a.value),
                },
                graph
            );
            command.execute();
            history.push(command);

            setNewNodeName('');
            setNewAttributes(newAttributes.map((a) => ({ ...a, value: '' })));
        },
        [graph, history, newAttributes, newNodeName, newNodeTags]
    );

    return (
        <>
            <h2 className="text-xl">{original ? 'Copy' : 'New'} Node</h2>
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
                {newAttributes.map((a, index) => (
                    <div key={index}>
                        <label>
                            Key:
                            <input
                                type="text"
                                value={a.key}
                                onChange={(event) => {
                                    const isLast =
                                        index === newAttributes.length - 1;

                                    const newAttributesCopy = [
                                        ...newAttributes,
                                    ];
                                    newAttributesCopy[index][0] =
                                        event.target.value;
                                    if (isLast) {
                                        newAttributesCopy.push({
                                            id: graph.getNewId(),
                                            key: '',
                                            value: '',
                                        });
                                    }
                                    setNewAttributes(newAttributesCopy);
                                }}
                            />
                        </label>
                        <label>
                            Value:
                            <input
                                type="text"
                                value={a.value}
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
                <div className="flex flex-row flex-wrap gap-1.5">
                    {newNodeTags.map((tagId) => (
                        <TagPill
                            key={tagId}
                            tag={graph.getTag(tagId)!}
                            onDelete={() => {
                                setNewNodeTags(
                                    newNodeTags.filter((tag) => tag !== tagId)
                                );
                            }}
                        />
                    ))}
                    <select
                        className="rounded-full bg-zinc-200 px-2 py-0.5 hover:bg-zinc-200  active:bg-zinc-300"
                        onChange={(e) => {
                            setNewNodeTags([
                                ...newNodeTags,
                                Number.parseInt(e.target.value),
                            ]);
                        }}
                        value="">
                        {graph.tags
                            .filter((tag) => !newNodeTags.includes(tag.id))
                            .map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        <option value={''}>Add Tag</option>
                    </select>
                </div>
                <div>
                    <Button type="submit">Add Node</Button>
                </div>
            </form>
        </>
    );
}
