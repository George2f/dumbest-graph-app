import { useState } from 'react';
import Modal from '../../../components/Modal';
import IComment from '../../../types/IComment';
import Button from '../../../components/Button';

interface IEditCommentModalProps {
    isOpen: boolean;
    onDismiss: () => void;
    comment: IComment;
    onDelete: () => void;
    onChange: (comment: IComment) => void;
}

export default function EditCommentModal({
    isOpen,
    onDismiss,
    comment,
    onDelete,
    onChange,
}: IEditCommentModalProps) {
    const [editCommentText, setEditCommentText] = useState<string>(
        comment.text
    );
    return (
        <Modal
            isOpen={isOpen}
            onDismiss={() => {
                onDismiss();
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
                    onDismiss();
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
    );
}
