import { useState } from 'react';
import IGraph from '../../../../../types/IGraph';
import INode from '../../../../../types/INode';
import TagPill from '../../../../../components/TagPill';
import Button from '../../../../../components/Button';
import Modal from '../../../../../components/Modal';
import NewCommentModule from '../../../../comment/NewCommentModule';
import CommentListModule from '../../../../comment/CommentListModule/CommentListModule';
import ConfirmModal from '../../../../../components/ConfirmModal';
import NodeDetailsModule from '../../../NodeDetailsModule/NodeDetailsModule';

interface INodeListItemProps {
    node: INode;
    onDelete: (node: INode) => void;
    graph: IGraph;
}

export default function NodeListItem({
    node,
    onDelete,
    graph,
}: INodeListItemProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
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
            <div className="my-2 rounded-xl bg-slate-200 p-2">
                <div className="rounded-lg bg-white p-1.5">
                    <Button
                        onClick={() => {
                            setIsEditModalOpen(true);
                        }}>
                        {node.id} {node.name}
                    </Button>
                    <Button
                        onClick={() => {
                            setIsConfirmModalOpen(true);
                        }}>
                        Delete
                    </Button>
                    <div className="flex flex-row flex-wrap gap-1.5">
                        {node.tags.map((tagId) => (
                            <TagPill key={tagId} tag={graph.getTag(tagId)!} />
                        ))}
                    </div>
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
            <Modal
                isOpen={isEditModalOpen}
                onDismiss={() => {
                    setIsEditModalOpen(false);
                }}>
                <NodeDetailsModule
                    node={node}
                    onChange={() => setIsEditModalOpen(false)}
                    onDelete={() => setIsEditModalOpen(false)}
                />
            </Modal>
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
