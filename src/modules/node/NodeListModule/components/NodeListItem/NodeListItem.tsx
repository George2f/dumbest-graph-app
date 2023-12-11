import { useState } from 'react';
import IGraph from '../../../../../types/IGraph';
import INode from '../../../../../types/INode';
import TagPill from '../../../../../components/TagPill';
import Button from '../../../../../components/Button';
import Modal from '../../../../../components/Modal';
import NewCommentModule from '../../../../comment/NewCommentModule';
import CommentListModule from '../../../../comment/CommentListModule';
import ConfirmModal from '../../../../../components/ConfirmModal';

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
    const [isNodeModalOpen, setIsNodeModalOpen] = useState<boolean>(false);
    const [isCommentListModalOpen, setIsCommentListModalOpen] =
        useState<boolean>(false);
    const [isNewCommentOpen, setIsNewCommentOpen] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] =
        useState<boolean>(false);

    const relatedComments = graph.comments.filter(
        (comment) => comment.targetId === node.id
    );

    return (
        <>
            <Modal
                isOpen={isNodeModalOpen}
                onDismiss={() => {
                    setIsNodeModalOpen(false);
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
                        setIsNodeModalOpen(false);
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
                                        editNodeTags.filter(
                                            (tag) => tag !== tagId
                                        )
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
                            onClick={() => {
                                setIsConfirmModalOpen(true);
                            }}>
                            Delete
                        </Button>
                    </div>
                </form>
            </Modal>

            <div className="my-2 rounded-r-xl bg-slate-200 p-2 pl-0">
                <div className="rounded-r-lg bg-white p-1.5">
                    <Button
                        onClick={() => {
                            setIsNodeModalOpen(true);
                        }}>
                        {node.id} {node.name}
                    </Button>
                    <Button
                        onClick={() => {
                            setIsConfirmModalOpen(true);
                        }}>
                        Delete
                    </Button>
                    <div>
                        Comments:
                        {relatedComments.length ? (
                            <Button
                                onClick={() => setIsCommentListModalOpen(true)}>
                                {relatedComments.length}
                            </Button>
                        ) : null}
                        <Button onClick={() => setIsNewCommentOpen(true)}>
                            Add
                        </Button>
                    </div>
                </div>
            </div>
            <NewCommentModule
                isOpen={isNewCommentOpen}
                node={node}
                onClose={() => setIsNewCommentOpen(false)}
            />
            <Modal
                isOpen={isCommentListModalOpen}
                onDismiss={() => setIsCommentListModalOpen(false)}>
                <CommentListModule node={node} />
            </Modal>
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onConfirm={() => {
                    onDelete(node);
                    setIsConfirmModalOpen(false);
                }}
                onDismiss={() => setIsConfirmModalOpen(false)}>
                Are you sure you want to delete this node?
            </ConfirmModal>
        </>
    );
}
