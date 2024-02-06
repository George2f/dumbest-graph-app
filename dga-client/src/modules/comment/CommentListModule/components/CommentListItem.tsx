import { useState } from 'react';
import Button from '../../../../components/Button';
import IComment from '../../../../types/IComment';
import IGraph from '../../../../types/IGraph';
import ConfirmModal from '../../../../components/ConfirmModal';
import EditCommentModal from './EditCommentModal';

interface ICommentListItemProps {
    comment: IComment;
    onDelete: () => void;
    onChange: (comment: IComment) => void;
    graph: IGraph;
}

export default function CommentListItem({
    onDelete,
    comment,
    onChange,
    graph,
}: ICommentListItemProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] =
        useState<boolean>(false);

    return (
        <>
            <EditCommentModal
                isOpen={isModalOpen}
                onDismiss={() => {
                    setIsModalOpen(false);
                }}
                comment={comment}
                onDelete={() => setIsConfirmModalOpen(true)}
                onChange={(newComment) => {
                    onChange(newComment);
                }}
            />
            <Button
                onClick={() => {
                    setIsModalOpen(true);
                }}
                className="text-left">
                <div>
                    {comment.id}{' '}
                    <strong>
                        {
                            (
                                graph.getNode(comment.targetId) ||
                                graph.getLink(comment.targetId)
                            )?.name
                        }
                    </strong>
                    {' - '}
                    {comment.text}
                </div>
            </Button>
            <Button onClick={() => setIsConfirmModalOpen(true)}>Delete</Button>
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onConfirm={() => {
                    onDelete();
                    setIsConfirmModalOpen(false);
                }}
                onDismiss={() => setIsConfirmModalOpen(false)}>
                <div>Are you sure you want to delete this comment?</div>
            </ConfirmModal>
        </>
    );
}
