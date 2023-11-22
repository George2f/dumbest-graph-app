import React, { useState } from 'react';
import IGraph from '../../../../types/IGraph';
import INode from '../../../../types/INode';
import TagPill from '../../../../components/TagPill';

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
                                <button
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
                                </button>
                            </div>
                            {editNodeTags.map((tagId) => (
                                <div>
                                    <TagPill tag={graph.getTag(tagId)!} />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setEditNodeTags(
                                                editNodeTags.filter(
                                                    (tag) => tag !== tagId
                                                )
                                            );
                                        }}>
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="submit">Save</button>
                    </form>
                </>
            ) : (
                <>
                    <button
                        onClick={() => {
                            setIsEditing(true);
                        }}>
                        {node.id} {node.name}
                    </button>
                </>
            )}
            <button
                onClick={() => {
                    onDelete(node);
                }}>
                Delete
            </button>
        </li>
    );
}
