import { useState } from 'react';
import ILink from '../../../../../types/ILink';
import generateLinkName from '../../../../../utils/parseLinkName';
import INode from '../../../../../types/INode';
import EditLinkModule from '../EditLinkModule';

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
    const [active, setActive] = useState(false);
    return (
        <li key={link.id}>
            {active ? (
                <EditLinkModule
                    link={link}
                    onChange={(link) => {
                        onChange(link);
                        setActive(false);
                    }}
                    nodes={nodes}
                    active={active}
                />
            ) : (
                <>
                    <button
                        onClick={() => {
                            setActive(true);
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
