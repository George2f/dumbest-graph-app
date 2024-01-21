import { useCallback, useState } from 'react';
import INode from '../../../types/INode';
import Button from '../../../components/Button';
import TagPill from '../../../components/TagPill';
import NewCommentModule from '../../comment/NewCommentModule';
import Modal from '../../../components/Modal';
import CommentListModule from '../../comment/CommentListModule';
import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import EditNodeCommand from '../../../Command/EditNodeCommand';
import DeleteNodeCommand from '../../../Command/DeleteNodeCommand';
import ConfirmModal from '../../../components/ConfirmModal';

interface INodeDetailsProps {
    node: INode;
    onChange?: () => void;
    onDelete?: () => void;
}

export default function NodeDetailsModule({
    node,
    onChange,
    onDelete,
}: INodeDetailsProps) {
    const graph = useGraph();
    const history = useHistory();

    const [editNodeTags, setEditNodeTags] = useState(node.tags || []);
    const [editNodeName, setEditNodeName] = useState(node.name);
    const [editNodeAttributes, setEditNodeAttributes] = useState<
        [string, string][]
    >(node.attributes?.concat([['', '']]) || [['', '']]);
    const [selectedNewTag, setSelectedNewTag] = useState<string>('');
    const [isNewCommentOpen, setIsNewCommentOpen] = useState<boolean>(false);
    const [isCommentListModalOpen, setIsCommentListModalOpen] =
        useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] =
        useState<boolean>(false);

    const relatedComments = graph.comments.filter(
        (comment) => comment.targetId === node.id
    );

    const handleSave = useCallback(() => {
        const command = new EditNodeCommand(
            {
                ...node,
                name: editNodeName,
                tags: editNodeTags,
                attributes: editNodeAttributes.filter(
                    ([key, value]) => key && value
                ),
            },
            graph
        );

        command.execute();
        history.push(command);

        onChange?.();
    }, [
        editNodeAttributes,
        editNodeName,
        editNodeTags,
        graph,
        history,
        node,
        onChange,
    ]);

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
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
                <div>Attributes:</div>
                {editNodeAttributes.map(([key, value], index) => (
                    <div key={index} className="">
                        <label className="flex flex-row">
                            Key:
                            <input
                                type="text"
                                className="w-full"
                                value={key}
                                onChange={(event) => {
                                    const isLast =
                                        index === editNodeAttributes.length - 1;

                                    const editAttributesCopy = [
                                        ...editNodeAttributes,
                                    ];
                                    editAttributesCopy[index][0] =
                                        event.target.value;
                                    if (isLast) {
                                        editAttributesCopy.push(['', '']);
                                    }
                                    setEditNodeAttributes(editAttributesCopy);
                                }}
                            />
                        </label>
                        <label className="flex flex-row">
                            Value:
                            <input
                                type="text"
                                className="w-full"
                                value={value}
                                onChange={(event) => {
                                    const newAttributes =
                                        editNodeAttributes.slice();
                                    newAttributes[index][1] =
                                        event.target.value;
                                    setEditNodeAttributes(newAttributes);
                                }}
                            />
                        </label>
                        {index === editNodeAttributes.length - 1 ? null : (
                            <Button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const newAttributes =
                                        editNodeAttributes.slice();
                                    newAttributes.splice(index, 1);
                                    setEditNodeAttributes(newAttributes);
                                }}>
                                Delete
                            </Button>
                        )}
                    </div>
                ))}
                <div>
                    <select
                        onChange={(e) => setSelectedNewTag(e.target.value)}
                        value={selectedNewTag}>
                        {graph.tags
                            .filter((tag) => !editNodeTags.includes(tag.id))
                            .map((tag) => (
                                <option key={tag.id} value={tag.id}>
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
                                    editNodeTags.filter((tag) => tag !== tagId)
                                );
                            }}
                        />
                    ))}
                </div>
                <div>
                    Comments:
                    {relatedComments.length ? (
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                setIsCommentListModalOpen(true);
                            }}>
                            {relatedComments.length}
                        </Button>
                    ) : null}
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsNewCommentOpen(true);
                        }}>
                        Add
                    </Button>
                </div>
                <div>
                    <Button type="submit">Save</Button>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsConfirmModalOpen(true);
                        }}>
                        Delete
                    </Button>
                </div>
            </form>
            <Modal
                isOpen={isCommentListModalOpen}
                onDismiss={() => setIsCommentListModalOpen(false)}>
                <CommentListModule node={node} />
            </Modal>
            <NewCommentModule
                isOpen={isNewCommentOpen}
                node={node}
                onClose={() => setIsNewCommentOpen(false)}
            />
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onConfirm={() => {
                    const command = new DeleteNodeCommand(node, graph);

                    command.execute();
                    history.push(command);
                    setIsConfirmModalOpen(false);
                    onDelete?.();
                }}
                onDismiss={() => setIsConfirmModalOpen(false)}>
                Are you sure you want to delete this node?
            </ConfirmModal>
        </>
    );
}
