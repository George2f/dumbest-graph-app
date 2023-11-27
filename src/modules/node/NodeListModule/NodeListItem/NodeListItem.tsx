import { useState } from 'react';
import IGraph from '../../../../types/IGraph';
import INode from '../../../../types/INode';
import TagPill from '../../../../components/TagPill';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';

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
    const [editNodeTags, setEditNodeTags] = useState(node.tags || []);
    const [editNodeName, setEditNodeName] = useState(node.name);
    const [selectedNewTag, setSelectedNewTag] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onDismiss={() => {
                    setIsModalOpen(false);
                    setEditNodeTags(node.tags || []);
                    setEditNodeName(node.name);
                }}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                        onChange({
                            ...node,
                            name: editNodeName,
                            tags: editNodeTags,
                        });
                        setIsModalOpen(false);
                    }}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={editNodeName}
                            onChange={(event) =>
                                setEditNodeName(event.target.value)
                            }
                        />
                    </label>
                    <div>
                        <select
                            onChange={(e) => setSelectedNewTag(e.target.value)}
                            value={selectedNewTag}>
                            {graph.tags
                                .filter((tag) => !editNodeTags.includes(tag.id))
                                .map((tag) => (
                                    <option value={tag.id}>{tag.name}</option>
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
                    <Button type="submit">Save</Button>
                    <Button
                        onClick={() => {
                            onDelete(node);
                        }}>
                        Delete
                    </Button>
                </form>
            </Modal>

            <>
                <Button
                    onClick={() => {
                        setIsModalOpen(true);
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
        </>
    );
}
