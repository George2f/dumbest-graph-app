import { useState } from 'react';
import ITag from '../../../../../types/ITag';
import TagPill from '../../../../../components/TagPill';
import Button from '../../../../../components/Button';
import ColorSquare from '../../../../../components/ColorSquare';
import Modal from '../../../../../components/Modal';

interface ITagListItemProps {
    onChange: (tag: ITag) => void;
    onDelete: (tag: ITag) => void;
    tag: ITag;
}

export default function TagListItem({
    onChange,
    onDelete,
    tag,
}: ITagListItemProps) {
    const [isEditing, setIsEditing] = useState(false);

    const [editTagName, setEditTagName] = useState(tag.name);
    const [editTagColor, setEditTagColor] = useState(tag.color);

    return (
        <li>
            <Modal isOpen={isEditing} onDismiss={() => setIsEditing(false)}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setIsEditing(false);

                        onChange({
                            ...tag,
                            name: editTagName,
                            color: editTagColor,
                        });
                    }}>
                    <div>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={editTagName}
                                onChange={(event) =>
                                    setEditTagName(event.target.value)
                                }
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Color:
                            <ColorSquare color={editTagColor} />
                            <input
                                type="text"
                                value={editTagColor}
                                onChange={(event) =>
                                    setEditTagColor(event.target.value)
                                }
                            />
                        </label>
                    </div>
                    <div>
                        <Button type="submit">Save</Button>
                        <Button
                            onClick={() => {
                                onDelete(tag);
                            }}>
                            Delete
                        </Button>
                    </div>
                </form>
            </Modal>

            <TagPill
                tag={tag}
                onDelete={() => onDelete(tag)}
                onEdit={() => setIsEditing(true)}
            />
        </li>
    );
}
