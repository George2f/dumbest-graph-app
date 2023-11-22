import { useState } from 'react';
import ITag from '../../../../../types/ITag';
import TagPill from '../../../../../components/TagPill';

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
            {isEditing ? (
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
                    <input
                        type="text"
                        value={editTagName}
                        onChange={(event) => setEditTagName(event.target.value)}
                    />
                    <input
                        type="text"
                        value={editTagColor}
                        onChange={(event) =>
                            setEditTagColor(event.target.value)
                        }
                    />
                    <button type="submit">Save</button>
                </form>
            ) : (
                <button
                    onClick={() => {
                        setIsEditing(true);
                    }}>
                    <TagPill tag={tag} />
                </button>
            )}
            <button
                onClick={() => {
                    onDelete(tag);
                }}>
                Delete
            </button>
        </li>
    );
}
