import { useState } from 'react';
import ITag from '../../../../../types/ITag';
import TagPill from '../../../../../components/TagPill';
import Button from '../../../../../components/Button';
import ColorSquare from '../../../../../components/ColorSquare';

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
                <div className="flex flex-col gap-1.5 bg-slate-200 p-1 shadow-2xl">
                    <form
                        className="rounded-md bg-white p-1.5 shadow-inner"
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
                </div>
            ) : (
                <TagPill
                    tag={tag}
                    onDelete={() => onDelete(tag)}
                    onEdit={() => setIsEditing(true)}
                />
            )}
        </li>
    );
}
