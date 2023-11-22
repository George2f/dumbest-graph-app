import { useState } from 'react';
import ILink from '../../../../../types/ILink';
import generateLinkName from '../../../../../utils/parseLinkName';
import INode from '../../../../../types/INode';
import EditLink from '../EditLink';

interface ILinkListItemProps {
    link: ILink;
    onDelete: () => void;
    onChange: (link: ILink) => void;
    nodes: INode[];
}

export default function LinkListItem({
    link,
    onDelete,
    onChange,
    nodes,
}: ILinkListItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    return (
        <li key={link.id}>
            {isEditing ? (
                <EditLink
                    link={link}
                    onChange={(link) => {
                        onChange(link);
                        setIsEditing(false);
                    }}
                    nodes={nodes}
                    active={isEditing}
                />
            ) : (
                <>
                    <button
                        onClick={() => {
                            setIsEditing(true);
                        }}>
                        {link.id}{' '}
                        {generateLinkName(
                            link,
                            nodes.find((n) => n.id === link.node1Id)?.name ||
                                '',
                            nodes.find((n) => n.id === link.node2Id)?.name || ''
                        )}
                    </button>
                </>
            )}
            <button onClick={onDelete}>Delete</button>
        </li>
    );
}
