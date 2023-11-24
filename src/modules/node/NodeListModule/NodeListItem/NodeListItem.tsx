import { useState } from 'react';
import IGraph from '../../../../types/IGraph';
import INode from '../../../../types/INode';
import TagPill from '../../../../components/TagPill';
import Button from '../../../../components/Button';

interface INodeListItemProps {
    node: INode;
    onChange: (node: INode) => void;
    onDelete: (node: INode) => void;
    graph: IGraph;
}

export default function NodeListItem({
    node,
    onChange,
    onDelete,
    graph,
}: INodeListItemProps) {
    const [isEditing, setIsEditing] = useState(false);

    const [editNodeTags, setEditNodeTags] = useState(node.tags || []);
    const [editNodeName, setEditNodeName] = useState(node.name);
    const [selectedNewTag, setSelectedNewTag] = useState<string>('');

    console.log(
        '🚀 : file: NodeListItem.tsx:94 : editNodeTags:',
        node.id,
        editNodeTags
    );

    return (
        <li>
            {isEditing ? (
                <>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();

                            onChange({
                                ...node,
                                name: editNodeName,
                                tags: editNodeTags,
                            });
                            setIsEditing(false);
                        }}>
                        <input
                            type="text"
                            value={editNodeName}
                            onChange={(event) =>
                                setEditNodeName(event.target.value)
                            }
                        />
                        <div>
                            <div>
                                <select
                                    onChange={(e) =>
                                        setSelectedNewTag(e.target.value)
                                    }
                                    value={selectedNewTag}>
                                    {graph.tags
                                        .filter(
                                            (tag) =>
                                                !editNodeTags.includes(tag.id)
                                        )
                                        .map((tag) => (
                                            <option value={tag.id}>
                                                {tag.name}
                                            </option>
                                        ))}
                                    <option value={''}>-</option>
                                </select>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (!selectedNewTag) return;
                                        setEditNodeTags([
                                            ...editNodeTags,
                                            Number.parseInt(selectedNewTag),
                                        ]);
                                        setSelectedNewTag('');
                                    }}>
                                    AddTag
                                </Button>
                            </div>
                            <div className="flex flex-row flex-wrap gap-1.5">
                                {editNodeTags.map((tagId) => (
                                    <TagPill
                                        key={tagId}
                                        tag={graph.getTag(tagId)!}
                                        onDelete={() => {
                                            setEditNodeTags(
                                                editNodeTags.filter(
                                                    (tag) => tag !== tagId
                                                )
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <Button type="submit">Save</Button>
                        <Button
                            onClick={() => {
                                onDelete(node);
                            }}>
                            Delete
                        </Button>
                    </form>
                </>
            ) : (
                <>
                    <Button
                        onClick={() => {
                            setIsEditing(true);
                        }}>
                        {node.id} {node.name}
                    </Button>
                    <Button
                        onClick={() => {
                            onDelete(node);
                        }}>
                        Delete
                    </Button>
                </>
            )}
        </li>
    );
}
