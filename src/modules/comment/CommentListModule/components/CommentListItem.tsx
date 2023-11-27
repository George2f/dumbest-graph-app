import { useState } from 'react';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import IComment from '../../../../types/IComment';
import IGraph from '../../../../types/IGraph';

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

    const [editCommentText, setEditCommentText] = useState<string>(
        comment.text
    );

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onDismiss={() => {
                    setIsModalOpen(false);
                    setEditCommentText(comment.text);
                }}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!editCommentText) return;
                        onChange({
                            ...comment,
                            text: editCommentText,
                        });
                        setIsModalOpen(false);
                    }}>
                    <label>
                        Text:
                        <input
                            type="text"
                            autoFocus
                            value={editCommentText}
                            onChange={(event) =>
                                setEditCommentText(event.target.value)
                            }
                        />
                    </label>
                    <div>
                        <Button type="submit">Save</Button>
                        <Button onClick={onDelete}>Delete</Button>
                    </div>
                </form>
            </Modal>
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
            <Button onClick={onDelete}>Delete</Button>
        </>
    );
}
